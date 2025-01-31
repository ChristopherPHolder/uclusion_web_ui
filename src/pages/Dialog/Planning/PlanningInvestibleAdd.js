import React, { useContext, useState } from 'react'
import _ from 'lodash'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Card, CardActions, CardContent, Checkbox, FormControlLabel, useMediaQuery, useTheme, } from '@material-ui/core'
import { addPlanningInvestible } from '../../../api/investibles'
import { processTextAndFilesForSave } from '../../../api/files'
import { formInvestibleLink, formMarketLink } from '../../../utils/marketIdPathFunctions'
import AssignmentList from './AssignmentList'
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext'
import { useLocation } from 'react-router';
import queryString from 'query-string'
import CardType, { QUESTION_TYPE, STORY_TYPE, SUGGEST_CHANGE_TYPE, TODO_TYPE } from '../../../components/CardType'
import DismissableText from '../../../components/Notifications/DismissableText'
import { InvestiblesContext } from '../../../contexts/InvestibesContext/InvestiblesContext'
import AddInitialVote from '../../Investible/Voting/AddInitialVote'
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext'
import {
  getMarketPresences,
  partialUpdateInvestment
} from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import { updateInvestment } from '../../../api/marketInvestibles'
import {
  getMarketComments,
  refreshMarketComments,
} from '../../../contexts/CommentsContext/commentsContextHelper'
import { CommentsContext } from '../../../contexts/CommentsContext/CommentsContext'
import { moveComments } from '../../../api/comments'
import NameField, { clearNameStoredState, getNameStoredState } from '../../../components/TextFields/NameField'
import Comment from '../../../components/Comments/Comment'
import { getAcceptedStage } from '../../../contexts/MarketStagesContext/marketStagesContextHelper'
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext'
import { assignedInStage } from '../../../utils/userFunctions'
import { getMarketInvestibles } from '../../../contexts/InvestibesContext/investiblesContextHelper'
import { nameFromDescription } from '../../../utils/stringFunctions'
import SpinningIconLabelButton from '../../../components/Buttons/SpinningIconLabelButton'
import { Clear, SettingsBackupRestore } from '@material-ui/icons'
import { editorReset, getControlPlaneName, useEditor } from '../../../components/TextEditors/quillHooks'
import { pushMessage } from '../../../utils/MessageBusUtils';
import { removeMessage } from '../../../contexts/NotificationsContext/notificationsContextReducer'
import { NotificationsContext } from '../../../contexts/NotificationsContext/NotificationsContext'
import { findMessagesForCommentId } from '../../../utils/messageUtils'
import { getQuillStoredState } from '../../../components/TextEditors/QuillEditor2'
import { getPageReducerPage, usePageStateReducer } from '../../../components/PageState/pageStateHooks'
import WarningDialog from '../../../components/Warnings/WarningDialog'
import { useLockedDialogStyles } from '../DialogBodyEdit'

function PlanningInvestibleAdd(props) {
  const {
    marketId, classes, onCancel, onSave, onSpinComplete, storyMaxBudget, fromCommentIds, votesRequired
  } = props;
  const intl = useIntl();
  const theme = useTheme();
  const mobileLayout = useMediaQuery(theme.breakpoints.down('sm'));
  const [commentsState, commentsDispatch] = useContext(CommentsContext);
  const [marketStagesState] = useContext(MarketStagesContext);
  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const [messagesState, messagesDispatch] = useContext(NotificationsContext);
  const [open, setOpen] = useState(false);
  const lockedDialogClasses = useLockedDialogStyles();
  const location = useLocation();
  function getUrlAssignee() {
    const { hash } = location;
    if (!_.isEmpty(hash)) {
      const values = queryString.parse(hash);
      const { assignee } = values;
      if (assignee) {
        return [assignee];
      }
    }
    return undefined;
  }
  const [assignments, setAssignments] = useState(getUrlAssignee());
  const nameId = `investibleAdd${marketId}`;
  const [isEmpty, setIsEmpty] = useState(!getNameStoredState(nameId));
  const comments = getMarketComments(commentsState, marketId) || [];
  function getUrlOpenForInvestment() {
    const { hash } = location;
    if (!_.isEmpty(hash)) {
      const values = queryString.parse(hash);
      const { start } = values;
      if (start) {
        return true;
      }
    }
    return undefined;
  }

  const [investibleState] = useContext(InvestiblesContext);
  const [presencesState] = useContext(MarketPresencesContext);
  const presences = getMarketPresences(presencesState, marketId) || [];
  const myPresence = presences.find((presence) => presence.current_user) || {};
  const [, marketPresencesDispatch] = useContext(MarketPresencesContext);
  const acceptedStage = getAcceptedStage(marketStagesState, marketId) || {};
  const [investibleAddStateFull, investibleAddDispatch] = usePageStateReducer('investibleAdd');
  const [investibleAddState, updateInvestibleAddState, investibleAddStateReset] =
    getPageReducerPage(investibleAddStateFull, investibleAddDispatch, marketId,
      {
        quantity: 50,
        maxBudget: '',
        maxBudgetUnit: '',
        skipApproval: false
      });
  const {
    skipApproval,
    maxBudget,
    maxBudgetUnit,
    quantity,
    uploadedFiles
  } = investibleAddState;
  const isAssignedToMe = (assignments || []).includes(myPresence.id);
  const isAssigned = !_.isEmpty(assignments);
  const editorName = `${marketId}-planning-inv-add`;
  const editorSpec = {
    marketId,
    placeHolder: intl.formatMessage({ id: 'investibleAddDescriptionDefault' }),
    onUpload: onS3Upload,
    value: getQuillStoredState(editorName)
  }
  const [Editor, editorController] = useEditor(editorName, editorSpec);

  function emptyNotEmptyChange(value) {
    setIsEmpty(value);
  }

  function onQuantityChange(event) {
    const { value } = event.target;
    updateInvestibleAddState({quantity: parseInt(value, 10)});
  }

  function onBudgetChange(event) {
    const { value } = event.target;
    if (value) {
      updateInvestibleAddState({maxBudget: parseInt(value, 10)});
    } else {
      updateInvestibleAddState({maxBudget: ''});
    }
  }

  function onUnitChange(event, value) {
    updateInvestibleAddState({maxBudgetUnit: value});
  }

  function onAssignmentsChange(newAssignments) {
    setAssignments(newAssignments);
  }

  function onS3Upload(metadatas) {
    updateInvestibleAddState({uploadedFiles: metadatas})
  }

  function zeroCurrentValues() {
    editorController(editorReset());
    clearInitialEditor();
    investibleAddStateReset();
    clearNameStoredState(nameId);
  }

  function handleCancel() {
    zeroCurrentValues();
    onCancel(formMarketLink(marketId));
  }

  const initialVoteEditorName = `${marketId}-add-initial-vote`;

  function clearInitialEditor() {
    pushMessage(getControlPlaneName(initialVoteEditorName), editorReset());
  }
  
  function handleSave(resolveComments) {
    const {
      uploadedFiles: filteredUploads,
      text: tokensRemoved,
    } = processTextAndFilesForSave(uploadedFiles, getQuillStoredState(editorName));
    const processedDescription = tokensRemoved ? tokensRemoved : ' ';
    const addInfo = {
      marketId,
      uploadedFiles: filteredUploads,
      description: processedDescription
    };
    const name = getNameStoredState(nameId);
    if (name) {
      addInfo.name = name;
    } else {
      addInfo.name = nameFromDescription(getQuillStoredState(editorName));
    }
    if (isAssigned) {
      addInfo.assignments = assignments;
    }
    if (skipApproval) {
      addInfo.stageId = acceptedStage.id;
    }
    const openForInvestment = getUrlOpenForInvestment();
    if (openForInvestment) {
      addInfo.openForInvestment = true;
    }
    return addPlanningInvestible(addInfo).then((inv) => {
      if (fromCommentIds) {
        const { investible } = inv;
        return moveComments(marketId, investible.id, fromCommentIds,
          resolveComments ? [requiresInputId] : undefined)
          .then((movedComments) => {
            fromCommentIds.forEach((commentId) => {
              const commentMessages = findMessagesForCommentId(commentId, messagesState) || [];
              commentMessages.forEach((message) => {
                messagesDispatch(removeMessage(message));
              });
            });
            const comments = getMarketComments(commentsState, marketId);
            refreshMarketComments(commentsDispatch, marketId, [...movedComments, ...comments]);
            return inv;
          });
      }
      return inv;
    }).then((inv) => {
      const { investible } = inv;
      onSave(inv);
      const link = formInvestibleLink(marketId, investible.id);
      if (isAssignedToMe || !isAssigned) {
        setOperationRunning(false);
        zeroCurrentValues();
        return onSpinComplete(link);
      }
      const reason = getQuillStoredState(initialVoteEditorName);
      const updateInfo = {
        marketId,
        investibleId: investible.id,
        newQuantity: quantity,
        currentQuantity: 0,
        newReasonText: reason,
        reasonNeedsUpdate: !_.isEmpty(reason),
        maxBudget,
        maxBudgetUnit
      };
      return updateInvestment(updateInfo).then(result => {
        const { commentResult, investmentResult } = result;
        const { commentAction, comment } = commentResult;
        if (commentAction !== "NOOP") {
          const comments = getMarketComments(commentsState, marketId);
          refreshMarketComments(commentsDispatch, marketId, [comment, ...comments]);
        }
        partialUpdateInvestment(marketPresencesDispatch, investmentResult, true);
        setOperationRunning(false);
        zeroCurrentValues();
        return onSpinComplete(link);
      });
    });
  }

  function getRequiresInputId() {
    // For now only supporting one since no UI to get more than one
    let aRequireInputId = undefined;
    (fromCommentIds || []).forEach((fromCommentId) => {
      const fromComment = comments.find((comment) => comment.id === fromCommentId);
      if (!fromComment.resolved && (assignments || []).includes(fromComment.created_by)
        && (fromComment.comment_type === QUESTION_TYPE || fromComment.comment_type === SUGGEST_CHANGE_TYPE)) {
        aRequireInputId = fromComment.id;
      }
    });
    return aRequireInputId;
  }

  const requiresInputId = getRequiresInputId();

  function getAddedComments() {
    return (fromCommentIds || []).map((fromCommentId) => {
      const fromComment = comments.find((comment) => comment.id === fromCommentId);
      return (
        <div style={{marginTop: "2rem"}}>
          <Comment
            depth={0}
            marketId={marketId}
            comment={fromComment}
            comments={comments}
            allowedTypes={[TODO_TYPE]}
            readOnly
          />
        </div>
      );
    });
  }

  const requiresInput = requiresInputId && !mobileLayout;

  const assignedInAcceptedStage = assignedInStage(getMarketInvestibles(investibleState, marketId), myPresence.id,
    acceptedStage.id, marketId);
  const acceptedFull = acceptedStage.allowed_investibles > 0 && assignedInAcceptedStage.length >= acceptedStage.allowed_investibles;

  return (
    <>
      <DismissableText textId='planningInvestibleAddHelp' />
      <Card className={classes.overflowVisible}>
        <CardType
          className={classes.cardType}
          label={`${intl.formatMessage({
            id: "investibleDescription"
          })}`}
          type={STORY_TYPE}
        />
        <CardContent>
          <div className={classes.cardContent}>
            <AssignmentList
              marketId={marketId}
              onChange={onAssignmentsChange}
              previouslyAssigned={getUrlAssignee()}
            />
            <fieldset className={classes.fieldset}>
              <legend>{intl.formatMessage({ id: 'agilePlanFormFieldsetLabelOptional' })}</legend>
              <FormControlLabel
                control={
                  <Checkbox
                    value={skipApproval}
                    disabled={votesRequired > 1 || acceptedFull || !acceptedStage.id ||
                    !(isAssignedToMe && assignments.length === 1)}
                    checked={skipApproval}
                    onClick={() => updateInvestibleAddState({ skipApproval: !skipApproval })}
                  />
                }
                label={intl.formatMessage({ id: 'skipApprovalExplanation' })}
              />
            </fieldset>
          </div>
          {Editor}
          <NameField onEmptyNotEmptyChange={emptyNotEmptyChange} id={nameId}
                     descriptionFunc={() => getQuillStoredState(editorName)}
                     useCreateDefault />
        </CardContent>
        {!isAssignedToMe && isAssigned && (
          <AddInitialVote
            marketId={marketId}
            storyMaxBudget={storyMaxBudget}
            onBudgetChange={onBudgetChange}
            onChange={onQuantityChange}
            newQuantity={quantity}
            onUnitChange={onUnitChange}
            maxBudget={maxBudget}
            maxBudgetUnit={maxBudgetUnit}
            editorName={initialVoteEditorName}
          />
        )}
        <CardActions className={classes.actions}>
          <SpinningIconLabelButton onClick={handleCancel} doSpin={false} icon={Clear}>
            {intl.formatMessage({ id: 'marketAddCancelLabel' })}
          </SpinningIconLabelButton>
          {requiresInput && (
            <SpinningIconLabelButton onClick={() => setOpen(true)} icon={SettingsBackupRestore} doSpin={false}
                                     disabled={isEmpty}>
              {intl.formatMessage({ id: 'agilePlanFormSaveLabel' })}
            </SpinningIconLabelButton>
          )}
          {requiresInput && (
            <WarningDialog
              classes={lockedDialogClasses}
              open={open}
              onClose={() => setOpen(false)}
              issueWarningId="requiresInputWarning"
              /* slots */
              actions={
                <>
                  <SpinningIconLabelButton onClick={handleSave} icon={SettingsBackupRestore}
                                           id="requiresInputProceedButton">
                    {intl.formatMessage({ id: 'proceedRequiresInput' })}
                  </SpinningIconLabelButton>
                  <SpinningIconLabelButton onClick={() => handleSave(true)} icon={SettingsBackupRestore}
                                           id="requiresInputResolveButton">
                    {intl.formatMessage({ id: 'resolveComment' })}
                  </SpinningIconLabelButton>
                </>
              }
            />
          )}
          {!requiresInput && (
            <SpinningIconLabelButton onClick={handleSave} icon={SettingsBackupRestore}
                                     disabled={isEmpty} id="planningInvestibleAddButton">
              {intl.formatMessage({ id: 'agilePlanFormSaveLabel' })}
            </SpinningIconLabelButton>
          )}
        </CardActions>
      </Card>
      {getAddedComments()}
    </>
  );
}

PlanningInvestibleAdd.propTypes = {
  classes: PropTypes.object.isRequired,
  marketId: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onSpinComplete: PropTypes.func,
  onSave: PropTypes.func,
  marketPresences: PropTypes.arrayOf(PropTypes.object).isRequired,
  storyMaxBudget: PropTypes.number
};

PlanningInvestibleAdd.defaultProps = {
  onSave: () => {
  },
  onSpinComplete: () => {},
  onCancel: () => {
  },
};

export default PlanningInvestibleAdd;
