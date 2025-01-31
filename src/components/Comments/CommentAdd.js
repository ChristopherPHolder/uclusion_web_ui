import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash'
import {
  Button, Checkbox,
  darken,
  FormControlLabel,
  makeStyles,
  Paper, useMediaQuery, useTheme,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { getMentionsFromText, saveComment } from '../../api/comments';
import {
  ISSUE_TYPE,
  QUESTION_TYPE,
  REPLY_TYPE,
  REPORT_TYPE,
  SUGGEST_CHANGE_TYPE,
  TODO_TYPE,
} from '../../constants/comments'
import { processTextAndFilesForSave } from '../../api/files'
import { OperationInProgressContext } from '../../contexts/OperationInProgressContext/OperationInProgressContext'
import { CommentsContext } from '../../contexts/CommentsContext/CommentsContext'
import { addCommentToMarket } from '../../contexts/CommentsContext/commentsContextHelper'
import { Dialog } from '../Dialogs'
import WarningIcon from '@material-ui/icons/Warning'
import { useLockedDialogStyles } from '../../pages/Dialog/DialogBodyEdit'
import {
  getBlockedStage, getInCurrentVotingStage,
  getInReviewStage,
  getRequiredInputStage
} from '../../contexts/MarketStagesContext/marketStagesContextHelper'
import { getInvestible } from '../../contexts/InvestibesContext/investiblesContextHelper';
import { InvestiblesContext } from '../../contexts/InvestibesContext/InvestiblesContext'
import { MarketStagesContext } from '../../contexts/MarketStagesContext/MarketStagesContext'
import { getMarketPresences } from '../../contexts/MarketPresencesContext/marketPresencesHelper'
import { MarketPresencesContext } from '../../contexts/MarketPresencesContext/MarketPresencesContext'
import { changeInvestibleStageOnCommentChange } from '../../utils/commentFunctions'
import { findMessageOfType, findMessageOfTypeAndId } from '../../utils/messageUtils'
import { removeMessage } from '../../contexts/NotificationsContext/notificationsContextReducer'
import { NotificationsContext } from '../../contexts/NotificationsContext/NotificationsContext'
import SpinningIconLabelButton from '../Buttons/SpinningIconLabelButton'
import { Add, Clear, Delete } from '@material-ui/icons'
import { editorFocus, editorReset, editorUpdate, getControlPlaneName, useEditor } from '../TextEditors/quillHooks'
import { getUiPreferences } from '../../contexts/AccountUserContext/accountUserContextHelper'
import { AccountUserContext } from '../../contexts/AccountUserContext/AccountUserContext'
import DismissableText from '../Notifications/DismissableText'
import { pushMessage } from '../../utils/MessageBusUtils'
import { getQuillStoredState } from '../TextEditors/QuillEditor2'

function getPlaceHolderLabelId (type, isStory, isInReview) {
  switch (type) {
    case QUESTION_TYPE:
      if (isStory) {
        return 'commentAddStoryQuestionDefault';
      }
      return 'commentAddQuestionDefault';
    case SUGGEST_CHANGE_TYPE:
      return 'commentAddSuggestDefault';
    case ISSUE_TYPE:
      return 'commentAddIssueDefault';
    case REPLY_TYPE:
      return 'commentAddReplyDefault';
    case REPORT_TYPE:
      if (isInReview) {
        return 'commentAddReviewReportDefault';
      }
      return 'commentAddReportDefault';
    case TODO_TYPE:
      return 'commentAddTODODefault';
    default:
      return 'commentAddSelectIssueLabel';
  }
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  hidden: {
    display: 'none',
  },
  add: {
    marginBottom: 16,
    padding: theme.spacing(0, 2)
  },
  editor: {
    flex: 1,
    maxWidth: '100%'
  },
  button: {
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 8,
    marginBottom: 0,
    textTransform: 'capitalize',
  },
  buttonPrimary: {
    backgroundColor: '#2d9cdb',
    color: '#fff',
    '&:hover': {
      backgroundColor: darken('#2d9cdb', 0.08)
    },
    '&:focus': {
      backgroundColor: darken('#2d9cdb', 0.24)
    },
  },
  addBox: {},
  todoLabelType: {
    alignSelf: "start",
    display: "inline-flex"
  },
  commentType: {
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  commentTypeGroup: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  chipItem: {
    color: '#fff',
    borderRadius: '8px',
    '& .MuiChip-label': {
      fontSize: 12,
    },
    '& .MuiFormControlLabel-label': {
      paddingRight: '5px',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      [theme.breakpoints.down('sm')]: {
        height: '100%',
        verticalAlign: 'middle',
        display: 'inline-block',
        '& .MuiSvgIcon-root': {
          display: 'block'
        }
      },
    },
    '& .MuiChip-avatar': {
      width: '16px',
      height: '14px',
      color: '#fff',
    },
    '& .MuiRadio-colorPrimary.Mui-checked':{
      '&.Mui-checked': {
        color: 'white'
      }
    },
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    margin: theme.spacing(0, 0, 0, 4),
    [theme.breakpoints.down('sm')]: {
      margin: '10px'
    },
  },
  selected: {
    opacity: 1
  },
  unselected: {
    opacity: '.6'
  },
  chipItemQuestion: {
    background: '#2F80ED',
  },
  chipItemIssue: {
    background: '#E85757',
    color: 'black'
  },
  chipItemSuggestion: {
    background: '#e6e969',
    color: 'black'
  },
  commentTypeContainer: {
    borderRadius: '4px 4px 0 0'
  }
}), { name: 'CommentAdd' });

function CommentAdd(props) {
  const {
    marketId, onSave, onCancel, type, investible, parent, issueWarningId, todoWarningId, isStory, nameKey,
    defaultNotificationType, onDone, mentionsAllowed, commentAddState, updateCommentAddState, commentAddStateReset,
    isAssigned, numProgressReport, autoFocus=true
  } = props;
  const {
    uploadedFiles,
    notificationType
  } = commentAddState;

  const intl = useIntl();
  const [commentsState, commentDispatch] = useContext(CommentsContext);
  const [investibleState, investibleDispatch] = useContext(InvestiblesContext);
  const [messagesState, messagesDispatch] = useContext(NotificationsContext);
  const [marketStagesState] = useContext(MarketStagesContext);
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const [openIssue, setOpenIssue] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(undefined);
  const classes = useStyles();
  const usedParent = parent || {};
  const { investible_id: parentInvestible, id: parentId } = usedParent;
  const investibleId = investible ? investible.id : parentInvestible;
  // TODO: this breaks if investible exists in more than one market
  const inv = getInvestible(investibleState, investibleId) || {};
  const { market_infos, investible: rootInvestible } = inv;
  const [info] = (market_infos || []);
  const { assigned, stage: currentStageId } = (info || {});
  const inReviewStage = getInReviewStage(marketStagesState, marketId) || {id: 'fake'};
  const readyForApprovalStage = getInCurrentVotingStage(marketStagesState, marketId) || {};
  const placeHolderLabelId = getPlaceHolderLabelId(type, isStory, currentStageId === inReviewStage.id);
  const placeHolder = intl.formatMessage({ id: placeHolderLabelId });
  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const [userState] = useContext(AccountUserContext);
  const theme = useTheme();
  const mobileLayout = useMediaQuery(theme.breakpoints.down('sm'));
  const presences = getMarketPresences(marketPresencesState, marketId) || [];
  const myPresence = presences.find((presence) => presence.current_user) || {};
  const blockingStage = getBlockedStage(marketStagesState, marketId) || {};
  const requiresInputStage = getRequiredInputStage(marketStagesState, marketId) || {};
  const investibleRequiresInput = ((type === QUESTION_TYPE || type === SUGGEST_CHANGE_TYPE)
      && (assigned || []).includes(myPresence.id)) && currentStageId !== blockingStage.id
    && currentStageId !== requiresInputStage.id;

  function toggleIssue () {
    setOpenIssue(!openIssue);
  }

  const editorName = `${nameKey ? nameKey : ''}${parentId ? parentId : investibleId ? investibleId : marketId}-comment-add-editor`;
  const useBody = getQuillStoredState(editorName);
  //console.debug(`use body is ${useBody} for ${editorName}`);
  const editorSpec = {
    value: useBody,
    participants: presences,
    marketId,
    placeholder: placeHolder,
    onUpload: (files) => updateCommentAddState({uploadedFiles: files}),
    mentionsAllowed
  }
  const [Editor, editorController] = useEditor(editorName, editorSpec);

  useEffect(() => {
    // If didn't focus to begin with then focus when type is changed
    if (type && !autoFocus) {
      // Can't use editorController here because the function is not invariant
      pushMessage(getControlPlaneName(editorName), editorFocus());
    }
    return () => {};
  }, [autoFocus, editorName, type]);

  useEffect(() => {
    if (autoFocus) {
      // Can't use editorController here because the function is not invariant
      pushMessage(getControlPlaneName(editorName), editorFocus());
    }
    return () => {};
  }, [autoFocus, editorName]);


  function clearMe () {
    // Reset doesn't work because value hasn't changed yet - I'm not clear on why this works
    editorController(editorUpdate (''));
    commentAddStateReset();
    setOpenIssue(false);
  }

  function myOnDone() {
    clearMe();
    onDone();
  }

  function handleClear () {
    // Reset doesn't work because value hasn't changed yet - I'm not clear on why this works
    editorController(editorUpdate (''));
    onCancel();
  }

  function handleSpinStop (comment) {
    clearMe();
    onSave(comment);
  }

  function handleSave () {
    const currentUploadedFiles = uploadedFiles || [];
    const {
      uploadedFiles: filteredUploads,
      text: tokensRemoved,
    } = processTextAndFilesForSave(currentUploadedFiles, getQuillStoredState(editorName));
    const mentions = getMentionsFromText(tokensRemoved);
    // the API does _not_ want you to send reply type, so suppress if our type is reply
    const apiType = (type === REPLY_TYPE) ? undefined : type;
    // what about not doing state?
    const inReviewStage = getInReviewStage(marketStagesState, marketId) || {};
    const investibleBlocks = (investibleId && apiType === ISSUE_TYPE) && currentStageId !== blockingStage.id;
    return saveComment(marketId, investibleId, parentId, tokensRemoved, apiType, filteredUploads, mentions,
      (notificationType || defaultNotificationType))
      .then((comment) => {
        commentAddStateReset();
        editorController(editorReset());
        changeInvestibleStageOnCommentChange(investibleBlocks, investibleRequiresInput,
          blockingStage, requiresInputStage, info, market_infos, rootInvestible, investibleDispatch, comment);
        addCommentToMarket(comment, commentsState, commentDispatch);
        if (apiType === REPORT_TYPE || (apiType === TODO_TYPE && inReviewStage.id === currentStageId)) {
          const message = findMessageOfType('REPORT_REQUIRED', investibleId, messagesState);
          if (message) {
            messagesDispatch(removeMessage(message));
          }
        }
        // Leaving a comment clears all READ level on the investible
        const message = findMessageOfTypeAndId(investibleId, messagesState);
        if (message) {
          messagesDispatch(removeMessage(message));
        }
        if (type === REPLY_TYPE) {
          const message = findMessageOfTypeAndId(parentId, messagesState);
          if (message) {
            messagesDispatch(removeMessage(message));
          }
        }
        if (doNotShowAgain) {
          return doNotShowAgain().then(() => {
            setOperationRunning(false);
            handleSpinStop(comment);
          });
        } else {
          setOperationRunning(false);
          handleSpinStop(comment);
        }
      });
  }

  function handleNotifyAllChange(event) {
    const { target: { checked } } = event;
    updateCommentAddState({notificationType: checked ? 'YELLOW' : undefined});
  }

  function getReportWarningId() {
    if (isAssigned) {
      if (numProgressReport > 0) {
        return 'addReportWarning';
      }
      if (currentStageId === readyForApprovalStage.id) {
        return 'addReportInReadyForApprovalWarning';
      }
    }
    return undefined;
  }

  const commentSaveLabel = parent ? 'commentAddSaveLabel' : 'commentReplySaveLabel';
  const commentCancelLabel = parent ? 'commentReplyCancelLabel' : 'commentAddCancelLabel';
  const myWarningId = type === TODO_TYPE ? todoWarningId : type === ISSUE_TYPE ? issueWarningId :
    type === REPORT_TYPE ? getReportWarningId() : investibleRequiresInput ? 'requiresInputWarningPlanning' : undefined;
  const userPreferences = getUiPreferences(userState) || {};
  const previouslyDismissed = userPreferences.dismissedText || [];
  const showIssueWarning = myWarningId && !previouslyDismissed.includes(myWarningId) && !mobileLayout;
  const lockedDialogClasses = useLockedDialogStyles();

  return (
    <>
      <Paper
        id={'cabox'}
        className={classes.add}
        elevation={0}
      >
        <div className={classes.editor}>
          {Editor}
          {!isStory && onDone && (
            <SpinningIconLabelButton onClick={myOnDone} doSpin={false} icon={Delete}>
              {intl.formatMessage({ id: 'cancel' })}
            </SpinningIconLabelButton>
          )}
          <SpinningIconLabelButton onClick={handleClear} doSpin={false} icon={Clear}>
            {intl.formatMessage({ id: commentCancelLabel })}
          </SpinningIconLabelButton>
          {!showIssueWarning && (
            <SpinningIconLabelButton
              onClick={handleSave}
              icon={Add}
              disabled={_.isEmpty(type)}
              id="commentSaveButton"
            >
              {intl.formatMessage({ id: commentSaveLabel })}
            </SpinningIconLabelButton>
          )}
          {showIssueWarning && (
            <SpinningIconLabelButton onClick={toggleIssue} icon={Add} doSpin={false}>
              {intl.formatMessage({ id: commentSaveLabel })}
            </SpinningIconLabelButton>
          )}
          {investible && type === REPORT_TYPE && (
            <FormControlLabel
              control={<Checkbox
                id="notifyAll"
                name="notifyAll"
                checked={notificationType === 'YELLOW'}
                onChange={handleNotifyAllChange}
              />}
              label={intl.formatMessage({ id: 'notifyAll' })}
            />
          )}
          <Button className={classes.button}>
            {intl.formatMessage({ id: 'edited' })}
          </Button>
          {myWarningId && (
            <IssueDialog
              classes={lockedDialogClasses}
              open={openIssue}
              onClose={toggleIssue}
              issueWarningId={myWarningId}
              checkBoxFunc={setDoNotShowAgain}
              /* slots */
              actions={
                <SpinningIconLabelButton onClick={handleSave} icon={Add} id="issueProceedButton"
                                         disabled={_.isEmpty(type)}>
                  {intl.formatMessage({ id: 'issueProceed' })}
                </SpinningIconLabelButton>
              }
            />
          )}
        </div>
      </Paper>
    </>
  );
}

function IssueDialog(props) {
  const { actions, classes, open, onClose, issueWarningId, checkBoxFunc } = props;

  const autoFocusRef = React.useRef(null);

  return (
    <Dialog
      autoFocusRef={autoFocusRef}
      classes={{
        root: classes.root,
        actions: classes.actions,
        content: classes.issueWarningContent,
        title: classes.title
      }}
      open={open}
      onClose={onClose}
      /* slots */
      actions={
        <React.Fragment>
          <SpinningIconLabelButton onClick={onClose} doSpin={false} icon={Clear} ref={autoFocusRef}>
            <FormattedMessage id="lockDialogCancel" />
          </SpinningIconLabelButton>
          {actions}
          <DismissableText textId={issueWarningId} checkBoxFunc={checkBoxFunc} />
        </React.Fragment>
      }
      content={<FormattedMessage id={issueWarningId} />}
      title={
        <React.Fragment>
          <WarningIcon className={classes.warningTitleIcon} />
          <FormattedMessage id="warning" />
        </React.Fragment>
      }
    />
  );
}

IssueDialog.propTypes = {
  actions: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  issueWarningId: PropTypes.string.isRequired,
};

CommentAdd.propTypes = {
  type: PropTypes.string,
  marketId: PropTypes.string.isRequired,
  issueWarningId: PropTypes.string,
  todoWarningId: PropTypes.string,
  onSave: PropTypes.func,
  investible: PropTypes.object,
  parent: PropTypes.object,
  onCancel: PropTypes.func,
  clearType: PropTypes.func,
  isStory: PropTypes.bool,
  defaultNotificationType: PropTypes.string,
  mentionsAllowed: PropTypes.bool,
};

CommentAdd.defaultProps = {
  parent: null,
  investible: null,
  todoWarningId: null,
  defaultNotificationType: undefined,
  onCancel: () => {},
  onSave: () => {},
  clearType: () => {},
  isStory: false,
  mentionsAllowed: true,
};

export default CommentAdd;
