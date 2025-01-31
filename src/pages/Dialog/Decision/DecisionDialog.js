/**
 * A component that renders a _decision_ dialog
 */
import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core'
import _ from 'lodash'
import AddIcon from '@material-ui/icons/Add'
import {
  baseNavListItem,
  formMarketLink,
  makeArchiveBreadCrumbs,
  makeBreadCrumbs,
} from '../../../utils/marketIdPathFunctions'
import ProposedIdeas from './ProposedIdeas'
import SubSection from '../../../containers/SubSection/SubSection'
import CurrentVoting from './CurrentVoting'
import CommentBox, { getSortedRoots } from '../../../containers/CommentBox/CommentBox'
import CommentAddBox from '../../../containers/CommentBox/CommentAddBox'
import Screen from '../../../containers/Screen/Screen'
import { ISSUE_TYPE, QUESTION_TYPE } from '../../../constants/comments'
import { EMPTY_SPIN_RESULT, SECTION_TYPE_SECONDARY } from '../../../constants/global'
import { ACTIVE_STAGE } from '../../../constants/markets'
import UclusionTour from '../../../components/Tours/UclusionTour'
import CardType from '../../../components/CardType'
import clsx from 'clsx'
import ExpiresDisplay from '../../../components/Expiration/ExpiresDisplay'
import ExpiredDisplay from '../../../components/Expiration/ExpiredDisplay'
import { useMetaDataStyles } from '../../Investible/Planning/PlanningInvestible'
import Collaborators from '../Collaborators'
import DialogActions from '../../Home/DialogActions'
import ParentSummary from '../ParentSummary'
import CardActions from '@material-ui/core/CardActions'
import ExpandableAction from '../../../components/SidebarActions/Planning/ExpandableAction'
import { MarketsContext } from '../../../contexts/MarketsContext/MarketsContext'
import { inviteDialogSteps } from '../../../components/Tours/dialog'
import { CognitoUserContext } from '../../../contexts/CognitoUserContext/CongitoUserContext'
import { startTour } from '../../../contexts/TourContext/tourContextReducer'
import { TourContext } from '../../../contexts/TourContext/TourContext'
import { INVITE_DIALOG_FIRST_VIEW } from '../../../contexts/TourContext/tourContextHelper'
import { attachFilesToMarket, deleteAttachedFilesFromMarket } from '../../../api/markets'
import { addMarketToStorage } from '../../../contexts/MarketsContext/marketsContextHelper'
import { DiffContext } from '../../../contexts/DiffContext/DiffContext'
import AttachedFilesList from '../../../components/Files/AttachedFilesList'
import { doSetEditWhenValid } from '../../../utils/windowUtils'
import DecisionInvestibleAdd from './DecisionInvestibleAdd'
import { addInvestible } from '../../../contexts/InvestibesContext/investiblesContextHelper'
import { InvestiblesContext } from '../../../contexts/InvestibesContext/InvestiblesContext'
import GavelIcon from '@material-ui/icons/Gavel';
import EditIcon from '@material-ui/icons/Edit'
import BlockIcon from '@material-ui/icons/Block'
import AgilePlanIcon from '@material-ui/icons/PlaylistAdd'
import QuestionIcon from '@material-ui/icons/ContactSupport'
import { getFakeCommentsArray } from '../../../utils/stringFunctions'
import { ExpandLess, QuestionAnswer, SettingsBackupRestore } from '@material-ui/icons'
import DialogBodyEdit from '../DialogBodyEdit'
import { getPageReducerPage, usePageStateReducer } from '../../../components/PageState/pageStateHooks'
import { SearchResultsContext } from '../../../contexts/SearchResultsContext/SearchResultsContext'
import SpinningIconLabelButton from '../../../components/Buttons/SpinningIconLabelButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getDiff, markDiffViewed } from '../../../contexts/DiffContext/diffContextHelper'
import { findMessageOfTypeAndId } from '../../../utils/messageUtils'
import { NotificationsContext } from '../../../contexts/NotificationsContext/NotificationsContext'
import { deleteSingleMessage } from '../../../api/users'
import { removeMessage } from '../../../contexts/NotificationsContext/notificationsContextReducer'
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext'

const useStyles = makeStyles(
  theme => ({
    root: {
      alignItems: "flex-start",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      overflow: "visible",
    },
    cardType: {
      display: "inline-flex"
    },
    cursorRegular: {},
    cursorEditable: {
      cursor: "url('/images/edit_cursor.svg') 0 24, pointer",
    },
    mobileColumn: {
      [theme.breakpoints.down("sm")]: {
        flexDirection: 'column'
      }
    },
    draft: {
      color: "#E85757"
    },
    borderLeft: {
      padding: '0 2rem 2rem 2rem',
      marginBottom: '-5px',
      marginTop: '-30px',
      [theme.breakpoints.down("sm")]: {
        padding: '1rem 0',
        marginTop: '1rem',
        borderLeft: 'none',
        borderTop: '1px solid #e0e0e0',
        flexGrow: 'unset',
        maxWidth: 'unset',
        flexBasis: 'auto'
      }
    },
    actions: {
      justifyContent: 'flex-end',
      '& > button': {
        marginRight: '-8px'
      },
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    content: {
      flexBasis: "100%",
      padding: theme.spacing(0, 0, 0, 4)
    },
    assignments: {
      padding: 0,
      "& ul": {
        flex: 4,
        margin: 0,
        padding: 0,
        flexDirection: 'row',
      },
      "& li": {
        display: "inline-block",
        fontWeight: "bold",
        marginLeft: theme.spacing(1)
      }
    },
    group: {
      backgroundColor: '#ecf0f1',
      borderRadius: 6,
      display: "flex",
      flexDirection: "row",
      padding: theme.spacing(1, 1),
      "&:first-child": {
        marginLeft: 0
      }
    },
    assignmentContainer: {
      width: '100%',
      textTransform: 'capitalize'
    },
    flexCenter: {
      [theme.breakpoints.down("sm")]: {
        alignItems: 'center',
        padding: '20px'
      }
    },
    fullWidthCentered: {
      alignItems: 'center',
      justifyContent: 'center',
      display: "flex",
      marginTop: '20px',
      [theme.breakpoints.down("sm")]: {
        maxWidth: '100%',
        flexBasis: '100%',
        flexDirection: 'column'
      }
    },
  }),
  { name: "DecisionDialog" }
);

function DecisionDialog(props) {
  const {
    market,
    hidden,
    investibles,
    comments,
    marketStages,
    marketPresences,
    myPresence,
    banner,
  } = props;
  const classes = useStyles();
  const metaClasses = useMetaDataStyles();
  const intl = useIntl();
  const isDraft = !_.isEmpty(myPresence) && marketPresences.length === 1;
  const {
    is_admin: isAdmin,
  } = myPresence;
  const [, tourDispatch] = useContext(TourContext);
  const [, marketsDispatch] = useContext(MarketsContext);
  const [diffState, diffDispatch] = useContext(DiffContext);
  const [, investiblesDispatch] = useContext(InvestiblesContext);
  const [searchResults] = useContext(SearchResultsContext);
  const [messagesState, messagesDispatch] = useContext(NotificationsContext);
  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const {
    id: marketId,
    name: marketName,
    market_stage: marketStage,
    market_type: marketType,
    created_at: createdAt,
    updated_at: updatedAt,
    expiration_minutes: expirationMinutes,
    created_by: createdBy,
    parent_market_id: parentMarketId,
    parent_investible_id: parentInvestibleId
  } = market;
  const myMessage = findMessageOfTypeAndId(marketId, messagesState);
  const diff = getDiff(diffState, marketId);
  const [pageStateFull, pageDispatch] = usePageStateReducer('market');
  const [pageState, updatePageState, pageStateReset] = getPageReducerPage(pageStateFull, pageDispatch, marketId);
  const {
    beingEdited,
    showDiff
  } = pageState;
  const [investibleAddStateFull, investibleAddDispatch] = usePageStateReducer('investibleAdd');
  const [investibleAddState, updateInvestibleAddState, investibleAddStateReset] =
    getPageReducerPage(investibleAddStateFull, investibleAddDispatch, marketId);
  const {
    investibleAddBeingEdited,
  } = investibleAddState;
  const underConsiderationStage = marketStages.find((stage) => stage.allows_investment);
  const proposedStage = marketStages.find((stage) => !stage.allows_investment);
  const history = useHistory();
  const investibleComments = comments.filter((comment) => comment.investible_id);
  const marketComments = comments.filter((comment) => !comment.investible_id);
  const allowedCommentTypes = [QUESTION_TYPE, ISSUE_TYPE];
  const user = useContext(CognitoUserContext) || {};
  const activeMarket = marketStage === ACTIVE_STAGE;
  const inArchives = !activeMarket || (myPresence && !myPresence.following);
  const breadCrumbs = inArchives ? makeArchiveBreadCrumbs(history) : makeBreadCrumbs(history);

  useEffect(() => {
    tourDispatch(startTour(INVITE_DIALOG_FIRST_VIEW));
  }, [tourDispatch]);

  function onAttachFile(metadatas) {
    return attachFilesToMarket(marketId, metadatas)
      .then((market) => {
        addMarketToStorage(marketsDispatch, diffDispatch, market, false);
      })
  }

  function toggleDiffShow() {
    if (showDiff) {
      markDiffViewed(diffDispatch, marketId);
    }
    updatePageState({showDiff: !showDiff});
  }

  function toggleInvestibleAdd() {
    updateInvestibleAddState({investibleAddBeingEdited: !investibleAddBeingEdited});
  }

  function isEditableByUser() {
    return isAdmin && !inArchives;
  }


  function mySetBeingEdited(isEdit, event) {
    doSetEditWhenValid(isEdit, isEditableByUser,
      (value) => updatePageState({beingEdited: value, name: marketName}), event,
      history);
  }

  function onDeleteFile(path) {
    return deleteAttachedFilesFromMarket(marketId, [path])
      .then((market) => {
        addMarketToStorage(marketsDispatch, diffDispatch, market, false);
        return EMPTY_SPIN_RESULT;
      })
  }

  function getInvestiblesForStage(stage) {
    if (stage) {
      return investibles.reduce((acc, inv) => {
        const { market_infos: marketInfos } = inv;
        for (let x = 0; x < marketInfos.length; x += 1) {
          if (marketInfos[x].stage === stage.id) {
            // filter out "deleted" investibles
            if (!marketInfos[x].deleted) {
              return [...acc, inv];
            }
          }
        }
        return acc;
      }, []);
    }
    return [];
  }
  const underConsideration = getInvestiblesForStage(underConsiderationStage);
  const proposed = getInvestiblesForStage(proposedStage);
  function createNavListItem(icon, textId, anchorId, howManyNum, alwaysShow) {
    return baseNavListItem(formMarketLink(marketId), icon, textId, anchorId, howManyNum, alwaysShow);
  }
  const sortedRoots = getSortedRoots(marketComments, searchResults);
  const closedComments = sortedRoots.filter((comment) => comment.resolved) || [];
  const { id: closedId } = getFakeCommentsArray(closedComments)[0];
  const openComments = sortedRoots.filter((comment) => !comment.resolved) || [];
  const questions = openComments.filter((comment) => comment.comment_type === QUESTION_TYPE);
  const { id: questionId } = getFakeCommentsArray(questions)[0];
  const blocked = openComments.filter((comment) => comment.comment_type === ISSUE_TYPE);
  const { id: blockedId } = getFakeCommentsArray(blocked)[0];
  const navigationMenu = {navHeaderIcon: GavelIcon,
    navListItemTextArray: [createNavListItem(EditIcon, 'description_label', 'dialogMain'),
      createNavListItem(AgilePlanIcon,'approvable', 'currentVoting', _.size(underConsideration),
        true),
      createNavListItem(AgilePlanIcon,'proposed', 'proposed', _.size(proposed), true),
      inArchives ? {} : createNavListItem(AddIcon,'commentAddBox'),
      createNavListItem(BlockIcon,'planningBlockedStageLabel', `c${blockedId}`, _.size(blocked)),
      createNavListItem(QuestionIcon,'questions', `c${questionId}`, _.size(questions)),
      createNavListItem(QuestionAnswer,'closedComments', `c${closedId}`, _.size(closedComments))
    ]};
  return (
    <Screen
      title={marketName}
      tabTitle={marketName}
      hidden={hidden}
      breadCrumbs={breadCrumbs}
      banner={banner}
      navigationOptions={navigationMenu}
    >
      <UclusionTour
        hidden={hidden}
        name={INVITE_DIALOG_FIRST_VIEW}
        steps={inviteDialogSteps(user)}
      />
      <Card className={classes.root}>
        <CardType
          className={classes.cardType}
          createdAt={createdAt}
          myBeingEdited={beingEdited}
        />
        <Grid id="dialogMain" container className={classes.mobileColumn}>
          <Grid item xs={9}
                className={!beingEdited && isEditableByUser() ? classes.cursorEditable : classes.cursorRegular}
                onClick={(event) => !beingEdited && mySetBeingEdited(true, event)}>
            <CardContent className={classes.content}>
              {isDraft && activeMarket && (
                <Typography className={classes.draft}>
                  {intl.formatMessage({ id: 'draft' })}
                </Typography>
              )}
              {marketId && myPresence.id && (
                <DialogBodyEdit hidden={hidden} setBeingEdited={mySetBeingEdited} market={market}
                                pageState={pageState} pageStateUpdate={updatePageState} pageStateReset={pageStateReset}
                                userId={myPresence.id} marketId={marketId} isEditableByUser={isEditableByUser}
                                beingEdited={beingEdited} />
              )}
            </CardContent>
          </Grid>
          <Grid className={classes.borderLeft} item xs={3}>
            <CardActions className={classes.actions}>
              <DialogActions
                isAdmin={myPresence.is_admin}
                isFollowing={myPresence.following}
                marketStage={marketStage}
                marketType={marketType}
                marketPresences={marketPresences}
                parentMarketId={parentMarketId}
                parentInvestibleId={parentInvestibleId}
                marketId={marketId}
                mySetBeingEdited={mySetBeingEdited}
                beingEdited={beingEdited}
              />
            </CardActions>
            <dl className={clsx(metaClasses.root, classes.flexCenter)}>
              {activeMarket ? (
                <ExpiresDisplay createdAt={createdAt} expirationMinutes={expirationMinutes} />
              ) : (
                <ExpiredDisplay expiresDate={updatedAt} />
              )}
              {marketPresences && (
                <>
                  <div className={classes.assignmentContainer}>
                    <FormattedMessage id="author" />
                    <div className={clsx(classes.group, classes.assignments)}>
                      <Collaborators
                        marketPresences={marketPresences}
                        authorId={createdBy}
                        intl={intl}
                        authorDisplay
                      />
                    </div>
                  </div>
                  <div className={classes.assignmentContainer}>
                    <FormattedMessage id="dialogParticipants" />
                    <div className={clsx(classes.group, classes.assignments)}>
                      <Collaborators
                        marketPresences={marketPresences}
                        authorId={createdBy}
                        intl={intl}
                        marketId={marketId}
                        history={history}
                      />
                    </div>
                  </div>
                </>
              )}
              <ParentSummary market={market} hidden={hidden}/>
            </dl>
            {myMessage && (
              <>
                <SpinningIconLabelButton icon={SettingsBackupRestore}
                                         onClick={() => {
                                           deleteSingleMessage(myMessage).then(() => {
                                             messagesDispatch(removeMessage(myMessage));
                                             setOperationRunning(false);
                                           }).finally(() => {
                                             setOperationRunning(false);
                                           });
                                         }}
                                         doSpin={true}>
                  <FormattedMessage id={'markDescriptionRead'} />
                </SpinningIconLabelButton>
                <div style={{paddingTop: '1rem'}} />
              </>
            )}
            {myMessage && diff && (
              <>
                <SpinningIconLabelButton icon={showDiff ? ExpandLess : ExpandMoreIcon}
                                         onClick={toggleDiffShow} doSpin={false}>
                  <FormattedMessage id={showDiff ? 'diffDisplayDismissLabel' : 'diffDisplayShowLabel'} />
                </SpinningIconLabelButton>
                <div style={{paddingTop: '0.5rem'}} />
              </>
            )}
            <dl className={metaClasses.root}>
              <AttachedFilesList
                key="files"
                marketId={marketId}
                isAdmin={isAdmin}
                attachedFiles={market.attached_files}
                onUpload={onAttachFile}
                onDeleteClick={onDeleteFile}
              />
            </dl>
          </Grid>
        </Grid>
      </Card>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ marginTop: '2rem' }}>
          {investibleAddBeingEdited && (
            <div style={{marginBottom: '2rem'}}>
              <DecisionInvestibleAdd
                marketId={marketId}
                onSave={(investible) => addInvestible(investiblesDispatch, () => {}, investible)}
                onCancel={toggleInvestibleAdd}
                onSpinComplete={toggleInvestibleAdd}
                isAdmin={isAdmin}
                pageState={investibleAddState}
                pageStateUpdate={updateInvestibleAddState}
                pageStateReset={investibleAddStateReset}
              />
            </div>
          )}
          <SubSection
            id="currentVoting"
            type={SECTION_TYPE_SECONDARY}
            title={intl.formatMessage({ id: 'decisionDialogCurrentVotingLabel' })}
            actionButton={ inArchives ? null :
              (<ExpandableAction
                icon={<AddIcon htmlColor="black"/>}
                label={intl.formatMessage({ id: 'decisionDialogAddExplanationLabel' })}
                openLabel={intl.formatMessage({ id: 'decisionDialogAddInvestibleLabel'})}
                onClick={toggleInvestibleAdd}
                disabled={!isAdmin}
                tipPlacement="top-end"
              />)}
          >
            <CurrentVoting
              marketPresences={marketPresences}
              investibles={underConsideration}
              marketId={marketId}
              comments={investibleComments}
              inArchives={inArchives}
              isAdmin={isAdmin}
            />
          </SubSection>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '1.5rem' }}>
          <SubSection
            id="proposed"
            type={SECTION_TYPE_SECONDARY}
            title={intl.formatMessage({ id: 'decisionDialogProposedOptionsLabel' })}
            actionButton={ inArchives ? null :
              (<ExpandableAction
                icon={<AddIcon htmlColor="black"/>}
                label={intl.formatMessage({ id: 'decisionDialogProposeExplanationLabel' })}
                openLabel={intl.formatMessage({ id: 'decisionDialogProposeInvestibleLabel'})}
                onClick={toggleInvestibleAdd}
                disabled={isAdmin}
                tipPlacement="top-end"
              />)}
          >
            <ProposedIdeas
              investibles={proposed}
              marketId={marketId}
              isAdmin={isAdmin}
            />
          </SubSection>
        </Grid>
        <Grid id="commentAddArea" item xs={12} style={{ marginTop: '71px' }}>
          {!inArchives && marketId && !hidden && (
            <CommentAddBox
              allowedTypes={allowedCommentTypes}
              marketId={marketId}
              issueWarningId="issueWarning"
            />
          )}
          <CommentBox
            comments={marketComments}
            marketId={marketId}
            allowedTypes={allowedCommentTypes}
          />
        </Grid>
      </Grid>
    </Screen>
  );
}

DecisionDialog.propTypes = {
  market: PropTypes.object.isRequired,
  investibles: PropTypes.arrayOf(PropTypes.object),
  comments: PropTypes.arrayOf(PropTypes.object),
  marketStages: PropTypes.arrayOf(PropTypes.object),
  marketPresences: PropTypes.arrayOf(PropTypes.object).isRequired,
  myPresence: PropTypes.object.isRequired,
  hidden: PropTypes.bool,
};

DecisionDialog.defaultProps = {
  investibles: [],
  comments: [],
  marketStages: [],
  hidden: false,
};

export default DecisionDialog;
