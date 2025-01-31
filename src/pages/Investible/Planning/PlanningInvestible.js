import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Button,
  Card,
  CardContent, Checkbox, FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
  Typography, useMediaQuery, useTheme
} from '@material-ui/core'
import { useHistory } from 'react-router'
import { FormattedMessage, useIntl } from 'react-intl'
import YourVoting from '../Voting/YourVoting'
import Voting from '../Decision/Voting'
import CommentBox, { getSortedRoots } from '../../../containers/CommentBox/CommentBox'
import {
  ISSUE_TYPE,
  JUSTIFY_TYPE,
  QUESTION_TYPE,
  REPORT_TYPE,
  SUGGEST_CHANGE_TYPE,
  TODO_TYPE
} from '../../../constants/comments'
import {
  baseNavListItem,
  formInvestibleEditLink, formInvestibleLink,
  formMarketArchivesLink,
  formMarketLink,
  makeArchiveBreadCrumbs,
  makeBreadCrumbs,
  navigate
} from '../../../utils/marketIdPathFunctions'
import Screen from '../../../containers/Screen/Screen'
import CommentAddBox from '../../../containers/CommentBox/CommentAddBox'
import MoveToNextVisibleStageActionButton from './MoveToNextVisibleStageActionButton'
import { assignedInStage, getMarketInfo, getVotesForInvestible } from '../../../utils/userFunctions'
import {
  getAcceptedStage,
  getBlockedStage,
  getFullStage,
  getFurtherWorkStage,
  getInCurrentVotingStage,
  getInReviewStage,
  getNotDoingStage,
  getRequiredInputStage,
  getVerifiedStage
} from '../../../contexts/MarketStagesContext/marketStagesContextHelper'
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext'
import MoveToVerifiedActionButton from './MoveToVerifiedActionButton'
import MoveToVotingActionButton from './MoveToVotingActionButton'
import MoveToNotDoingActionButton from './MoveToNotDoingActionButton'
import MoveToAcceptedActionButton from './MoveToAcceptedActionButton'
import MoveToInReviewActionButton from './MoveToInReviewActionButton'
import EditMarketButton from '../../Dialog/EditMarketButton'
import CardType from '../../../components/CardType'
import clsx from 'clsx'
import DismissableText from '../../../components/Notifications/DismissableText'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { EMPTY_SPIN_RESULT } from '../../../constants/global'
import {
  addInvestible,
  getMarketLabels,
  refreshInvestibles
} from '../../../contexts/InvestibesContext/investiblesContextHelper'
import { InvestiblesContext } from '../../../contexts/InvestibesContext/InvestiblesContext'
import AddIcon from '@material-ui/icons/Add'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoveToFurtherWorkActionButton from './MoveToFurtherWorkActionButton'
import { DaysEstimate } from '../../../components/AgilePlan'
import { ACTION_BUTTON_COLOR, HIGHLIGHTED_BUTTON_COLOR } from '../../../components/Buttons/ButtonConstants'
import AttachedFilesList from '../../../components/Files/AttachedFilesList'
import {
  attachFilesToInvestible,
  changeLabels,
  deleteAttachedFilesFromInvestible,
  updateInvestible
} from '../../../api/investibles';
import { DiffContext } from '../../../contexts/DiffContext/DiffContext'
import ShareStoryButton from './ShareStoryButton'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import EventIcon from '@material-ui/icons/Event';
import DatePicker from 'react-datepicker'
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext'
import { doSetEditWhenValid, invalidEditEvent } from '../../../utils/windowUtils'
import Gravatar from '../../../components/Avatars/Gravatar';
import { getInvestibleVoters } from '../../../utils/votingUtils';
import { getCommenterPresences, inVerifedSwimLane } from '../../Dialog/Planning/userUtils';
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext';
import { NotificationsContext } from '../../../contexts/NotificationsContext/NotificationsContext'
import { findMessageOfType, findMessageOfTypeAndId } from '../../../utils/messageUtils'
import { removeMessage } from '../../../contexts/NotificationsContext/notificationsContextReducer'
import QuestionIcon from '@material-ui/icons/ContactSupport'
import UpdateIcon from '@material-ui/icons/Update'
import BlockIcon from '@material-ui/icons/Block'
import ChangeSuggstionIcon from '@material-ui/icons/ChangeHistory'
import ListAltIcon from '@material-ui/icons/ListAlt'
import EditIcon from '@material-ui/icons/Edit'
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown'
import { getFakeCommentsArray } from '../../../utils/stringFunctions'
import { ExpandLess, QuestionAnswer, SettingsBackupRestore } from '@material-ui/icons'
import AssignmentIcon from '@material-ui/icons/Assignment'
import InvestibleBodyEdit from '../InvestibleBodyEdit';
import { getPageReducerPage, usePageStateReducer } from '../../../components/PageState/pageStateHooks'
import { pushMessage } from '../../../utils/MessageBusUtils'
import {
  LOCK_INVESTIBLE,
  LOCK_INVESTIBLE_CHANNEL
} from '../../../contexts/InvestibesContext/investiblesContextMessages'
import SpinningIconLabelButton from '../../../components/Buttons/SpinningIconLabelButton'
import { getDiff, markDiffViewed } from '../../../contexts/DiffContext/diffContextHelper'
import { notify, onInvestibleStageChange } from '../../../utils/investibleFunctions'
import { INVESTIBLE_SUBMITTED_TYPE, YELLOW_LEVEL } from '../../../constants/notifications'
import { SearchResultsContext } from '../../../contexts/SearchResultsContext/SearchResultsContext'
import { deleteSingleMessage } from '../../../api/users'
import WarningDialog from '../../../components/Warnings/WarningDialog'
import { useLockedDialogStyles } from '../../Dialog/DialogBodyEdit'

const useStyles = makeStyles(
  theme => ({
    root: {
      alignItems: "flex-start",
      display: "flex"
    },
    container: {
      padding: "3px 89px 21px 21px",
      marginTop: "-6px",
      boxShadow: "none",
      [theme.breakpoints.down("sm")]: {
        padding: "3px 21px 42px 21px"
      }
    },
    explain: {
      fontSize: 12,
    },
    content: {
      fontSize: "15 !important",
      lineHeight: "175%",
      color: "#414141",
      [theme.breakpoints.down("sm")]: {
        fontSize: 13
      },
      "& > .ql-container": {
        fontSize: "15 !important"
      }
    },
    cardType: {
      display: "inline-flex"
    },
    mobileColumn: {
      overflowWrap: "break-word",
      [theme.breakpoints.down("sm")]: {
        flexDirection: 'column'
      }
    },
    editCardContent: {
      margin: theme.spacing(2, 1, 2, 2),
      padding: 0,
      '& img': {
        margin: '.75rem 0',
      },
      [theme.breakpoints.down("sm")]: {
        margin: 0,
        padding: '15px'
      }
    },
    votingCardContent: {
      margin: theme.spacing(0, 2, 2, 2),
      padding: 0,
      '& img': {
        margin: '.75rem 0',
      },
      [theme.breakpoints.down("sm")]: {
        margin: 0,
        padding: '15px'
      }
    },
    actions: {},
    blue: {
      backgroundColor: '#2d9cdb',
    },
    upperRightCard: {
      display: "inline-flex",
      float: "right",
      padding: 0,
      margin: 0,
    },
    borderRight: {
      [theme.breakpoints.down("sm")]: {
        padding: '1rem 0',
        marginTop: '1rem',
        borderRight: 'none',
        borderBottom: '1px solid #e0e0e0',
        flexGrow: 'unset',
        maxWidth: 'unset',
        flexBasis: 'auto'
      }
    },
    borderLeft: {
      paddingLeft: '1rem',
      marginTop: '-1.5rem',
      [theme.breakpoints.down("sm")]: {
        padding: '1rem 0',
        marginTop: '1rem',
        borderLeft: 'none',
        flexGrow: 'unset',
        maxWidth: 'unset',
        marginRight: 'unset',
        flexBasis: 'auto'
      }
    },
    editRow: {
      height: '3rem',
      display: "flex",
      marginTop: '0.3rem'
    },
    fullWidthCentered: {
      justifyContent: 'center',
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        maxWidth: '100%',
        flexBasis: '100%',
        flexDirection: 'column'
      }
    },
    autocompleteContainer: {
      display: 'flex',
      marginLeft: '30px',
      [theme.breakpoints.down("sm")]: {
        marginLeft: '0',
        flexDirection: 'column',
        paddingBottom: '1rem'
      }
    },
    labelChip: {
      paddingRight: '10px',
      paddingTop: '0.5rem',
      maxHeight: '1rem',
      [theme.breakpoints.down("sm")]: {
        paddingRight: 0,
        paddingTop: 'unset',
        maxHeight: 'unset',
        paddingBottom: '5px'
      }
    },
    labelExplain: {
      marginLeft: '10px',
      width: 90,
      [theme.breakpoints.down("sm")]: {
        width: 'auto',
      }
    },
    fullWidthEditable: {
      paddingLeft: '2rem',
      paddingTop: '1rem',
      cursor: "url('/images/edit_cursor.svg') 0 24, pointer",
      [theme.breakpoints.down("sm")]: {
        maxWidth: '100%',
        flexBasis: '100%',
        borderLeft: 'none',
        marginLeft: 'unset'
      }
    },
    fullWidth: {
      paddingLeft: '2rem',
      paddingTop: '1rem',
      [theme.breakpoints.down("sm")]: {
        maxWidth: '100%',
        flexBasis: '100%',
        borderLeft: 'none',
        marginLeft: 'unset'
      }
    },
    datePicker: {
      position: 'absolute',
      zIndex: 1000
    },
    assignments: {
      padding: 0,
      "& ul": {
        flex: 4,
        margin: 0,
        padding: 0
      },
      "& li": {
        display: "inline-flex",
        marginLeft: theme.spacing(1)
      }
    },
    assignmentContainer: {
      width: '100%',
      textTransform: 'capitalize'
    },
    assignIconContainer: {
      display: 'flex',
      justifyContent: 'center'
    },
    assignmentFlexRow: {
      width: '100%',
      maxWidth: '20rem',
      display: 'flex',
      padding: '8px'
    },
    rolesRoot: {
      alignItems: "flex-start",
      display: "flex",
      flexDirection: 'column',
      width: '100%',
      '& > div': {
        borderRadius: '6px',
        marginBottom: '1rem'
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
      },
      [theme.breakpoints.down("sm")]: {
        backgroundColor: '#fff',
      }
    },
  }),
  { name: "PlanningInvestible" }
);

/**
 * A page that represents what the investible looks like for a DECISION Dialog
 * @param props
 * @constructor
 */
function PlanningInvestible(props) {
  const history = useHistory();
  const intl = useIntl();
  const {
    investibleId,
    marketPresences,
    investibleComments,
    userId,
    market,
    marketInvestible,
    investibles,
    isAdmin,
    inArchives,
    hidden
  } = props;
  const lockedDialogClasses = useLockedDialogStyles();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const mobileLayout = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [investiblesState, investiblesDispatch] = useContext(InvestiblesContext);
  const [messagesState, messagesDispatch] = useContext(NotificationsContext);
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const [, diffDispatch] = useContext(DiffContext);
  const [searchResults] = useContext(SearchResultsContext);
  const { results, parentResults, search } = searchResults;
  const [changeStagesExpanded, setChangeStagesExpanded] = useState(false);
  const [newLabel, setNewLabel] = useState(undefined);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [clearMeHack, setClearMeHack] = useState('a');
  const [labelFocus, setLabelFocus] = useState(false);
  const { name: marketName, id: marketId } = market;
  const labels = getMarketLabels(investiblesState, marketId);
  const investmentReasonsRemoved = investibleComments.filter(comment => comment.comment_type !== JUSTIFY_TYPE) || [];
  const investmentReasons = investibleComments.filter((comment) => {
    if (_.isEmpty(search)) {
      return comment.comment_type === JUSTIFY_TYPE;
    }
    return comment.comment_type === JUSTIFY_TYPE && (results.find((item) => item.id === comment.id)
      || parentResults.find((id) => id === comment.id));
  });
  const investibleCommentorPresences = getCommenterPresences(marketPresences, investibleComments, marketPresencesState);
  const voters = getInvestibleVoters(marketPresences, investibleId);
  const concated = [...voters, ...investibleCommentorPresences];
  const investibleCollaborators = _.uniq((concated || []).map((presence) => presence.id));
  const marketInfo = getMarketInfo(marketInvestible, marketId) || {};
  const { stage, assigned: invAssigned, completion_estimate: marketDaysEstimate,
    required_approvers:  requiredApprovers, required_reviews: requiredReviewers, ticket_code: ticketCode,
    open_for_investment: openForInvestment } = marketInfo;
  const [daysEstimate, setDaysEstimate] = useState(marketDaysEstimate);
  const assigned = invAssigned || [];
  const { investible } = marketInvestible;
  const { name, locked_by: lockedBy, created_at: createdAt, label_list: originalLabelList } = investible;
  const [labelList, setLabelList] = useState(originalLabelList);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [marketStagesState] = useContext(MarketStagesContext);
  const [pageStateFull, pageDispatch] = usePageStateReducer('investible');
  const [pageState, updatePageState, pageStateReset] = getPageReducerPage(pageStateFull, pageDispatch, investibleId);
  const {
    beingEdited,
  } = pageState;

  const [votingPageStateFull, votingPageDispatch] = usePageStateReducer('voting');
  const [votingPageState, updateVotingPageState, votingPageStateReset] =
    getPageReducerPage(votingPageStateFull, votingPageDispatch, investibleId);
  const inCurrentVotingStage = getInCurrentVotingStage(
    marketStagesState,
    marketId
  ) || {};
  const isInVoting = inCurrentVotingStage && stage === inCurrentVotingStage.id;
  const canVote = isInVoting && !inArchives;
  const yourPresence = marketPresences.find((presence) => presence.current_user);
  const yourVote = yourPresence && yourPresence.investments &&
    yourPresence.investments.find((investment) => investment.investible_id === investibleId && !investment.deleted);
  // If you have a vote already then do not display voting input
  const displayVotingInput = canVote && !yourVote && _.isEmpty(search);

  let lockedByName;
  if (lockedBy) {
    const lockedByPresence = marketPresences.find(
      presence => presence.id === lockedBy
    );
    if (lockedByPresence) {
      const { name } = lockedByPresence;
      lockedByName = name;
    }
  }

  const [operationRunning, setOperationRunning] = useContext(OperationInProgressContext);
  const inReviewStage = getInReviewStage(marketStagesState, marketId) || {};
  const isInReview = inReviewStage && stage === inReviewStage.id;
  const inAcceptedStage = getAcceptedStage(marketStagesState, marketId) || {};
  const isInAccepted = inAcceptedStage && stage === inAcceptedStage.id;
  const inBlockedStage = getBlockedStage(marketStagesState, marketId) || {};
  const isInBlocked = inBlockedStage && stage === inBlockedStage.id;
  const inVerifiedStage = getVerifiedStage(marketStagesState, marketId) || {};
  const isInVerified = inVerifiedStage && stage === inVerifiedStage.id;
  const furtherWorkStage = getFurtherWorkStage(marketStagesState, marketId) || {};
  const isReadyFurtherWork = furtherWorkStage && stage === furtherWorkStage.id;
  const requiresInputStage = getRequiredInputStage(marketStagesState, marketId) || {};
  const isRequiresInput = requiresInputStage && stage === requiresInputStage.id;
  const notDoingStage = getNotDoingStage(marketStagesState, marketId);
  const isInNotDoing = notDoingStage && stage === notDoingStage.id;
  const isAssigned = assigned.includes(userId);
  const displayEdit = isAdmin && !inArchives && (isAssigned || isInNotDoing || isInVoting || isReadyFurtherWork || isRequiresInput);
  const myPresence = marketPresences.find((presence) => presence.current_user) || {};
  const fullStage = getFullStage(marketStagesState, marketId, stage) || {};
  const inMarketArchives = isInNotDoing || isInVerified;
  const breadCrumbTemplates = [
    { name: marketName, link: formMarketLink(marketId) }
  ];
  if (inMarketArchives && !inVerifedSwimLane(marketInvestible, investibles, inVerifiedStage, marketId)) {
    breadCrumbTemplates.push({
      name: intl.formatMessage({ id: "dialogArchivesLabel" }),
      link: formMarketArchivesLink(marketId)
    });
  }
  const breadCrumbs = inArchives
    ? makeArchiveBreadCrumbs(history, breadCrumbTemplates)
    : makeBreadCrumbs(history, breadCrumbTemplates);
  function canGetInput() {
    const blockingComments = investibleComments.filter(
      comment => comment.comment_type === ISSUE_TYPE && !comment.resolved
    );
    return _.isEmpty(blockingComments) && !isInVerified && !isInNotDoing;
  }
  function canOpenBlocking() {
    const assignedInputComments = investibleComments.filter(
      comment => (comment.comment_type === QUESTION_TYPE || comment.comment_type === SUGGEST_CHANGE_TYPE)
        && !comment.resolved && assigned.includes(comment.created_by)
    );
    return _.isEmpty(assignedInputComments) && !isInVerified && !isInNotDoing;
  }
  const allowedCommentTypes =  [TODO_TYPE, REPORT_TYPE];
  if (canGetInput()) {
    allowedCommentTypes.push(QUESTION_TYPE);
    allowedCommentTypes.push(SUGGEST_CHANGE_TYPE);
  }
  if (canOpenBlocking()) {
    allowedCommentTypes.push(ISSUE_TYPE);
  }

  const invested = getVotesForInvestible(marketPresences, investibleId);

  function changeLabelsAndQuickAdd(marketId, investibleId, newLabels) {
    return changeLabels(marketId, investibleId, newLabels).then((fullInvestible) =>{
      refreshInvestibles(investiblesDispatch, diffDispatch, [fullInvestible]);
    });
  }

  function deleteLabel(aLabel) {
    const originalLabels = labelList || [];
    const newLabels = originalLabels.filter((label) => aLabel !== label) || [];
    setLabelList(newLabels);
    changeLabelsAndQuickAdd(marketId, investibleId, newLabels).catch(() => setLabelList(originalLabels));
  }

  function labelInputOnChange(event, value) {
    setNewLabel(value);
  }

  function labelInputFocus() {
    setLabelFocus(!labelFocus);
  }

  function addLabel() {
    const formerLabels = labelList ? labelList : [];
    const newLabels = [...formerLabels, newLabel];
    setLabelList(newLabels);
    changeLabelsAndQuickAdd(marketId, investibleId, newLabels).catch(() => setLabelList(formerLabels));
    setNewLabel(undefined);
    setClearMeHack(clearMeHack+clearMeHack);
  }

  const assignedInAcceptedStage = assigned.reduce((acc, userId) => {
    return acc.concat(assignedInStage(
      investibles,
      userId,
      inAcceptedStage.id,
      marketId
    ));
  }, []);
  const blockingComments = investibleComments.filter(
    comment => comment.comment_type === ISSUE_TYPE && !comment.resolved
  );
  const todoComments = investibleComments.filter(
    comment => comment.comment_type === TODO_TYPE && !comment.resolved
  );
  const numProgressReport = investibleComments.filter(comment => comment.comment_type === REPORT_TYPE)||[];
  const questionByAssignedComments = investibleComments.filter(
    comment => comment.comment_type === QUESTION_TYPE && !comment.resolved && assigned.includes(comment.created_by)
  );
  const acceptedFull = inAcceptedStage.allowed_investibles > 0
    && assignedInAcceptedStage.length >= inAcceptedStage.allowed_investibles;
  function getStageActions() {
    if (inArchives) {
      return [];
    }

    if (isInNotDoing) {
      return [<MenuItem
        key="furtherwork"
      >
        <MoveToFurtherWorkActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          onSpinStop={() => setAnchorEl(null)}
          disabled={isReadyFurtherWork}
        />
      </MenuItem>];
    }

    if (isReadyFurtherWork) {
      return [
        <MenuItem
          key="notdoing"
        >
          <MoveToNotDoingActionButton
            investibleId={investibleId}
            marketId={marketId}
            currentStageId={stage}
            isOpen={changeStagesExpanded}
            onSpinStop={() => setAnchorEl(null)}
            disabled={isInNotDoing}
          />
        </MenuItem>
      ];
    }
    return [
      <MenuItem
        key="voting"
        >
        <MoveToVotingActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          onSpinStop={() => setAnchorEl(null)}
          disabled={isInVoting || !_.isEmpty(blockingComments)}
          hasAssignedQuestions={!_.isEmpty(questionByAssignedComments)}
        />
      </MenuItem>,
      <MenuItem
        key="accepted"
        >
        <MoveToAcceptedActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          full={acceptedFull}
          onSpinStop={() => setAnchorEl(null)}
          disabled={!isAssigned || !_.isEmpty(blockingComments) || acceptedFull}
          hasAssignedQuestions={!_.isEmpty(questionByAssignedComments)}
        />
      </MenuItem>,
      <MenuItem
        key="inreview"
        >
        <MoveToInReviewActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          onSpinStop={() => setAnchorEl(null)}
          disabled={isInReview || !_.isEmpty(blockingComments)}
          hasAssignedQuestions={!_.isEmpty(questionByAssignedComments)}
        />
      </MenuItem>,
      <MenuItem
        key="furtherwork"
        >
        <MoveToFurtherWorkActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          onSpinStop={() => setAnchorEl(null)}
          disabled={isReadyFurtherWork}
        />
      </MenuItem>,
      <MenuItem
        key="verified"
        >
        <MoveToVerifiedActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          onSpinStop={() => setAnchorEl(null)}
          disabled={isInVerified || !_.isEmpty(blockingComments)}
          hasTodos={!_.isEmpty(todoComments)}
        />
      </MenuItem>,
      <MenuItem
        key="notdoing"
        >
        <MoveToNotDoingActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          onSpinStop={() => setAnchorEl(null)}
          disabled={isInNotDoing}
        />
      </MenuItem>
    ];
  }

  const todoWarning = isInVoting || isReadyFurtherWork || isInBlocked || isRequiresInput ? null : 'todoWarningPlanning';
  function toggleAssign() {
    navigate(history, `${formInvestibleEditLink(marketId, investibleId)}#assign=true`);
  }
  function toggleEdit() {
    setShowDatepicker(!showDatepicker);
  }
  function getStartDate() {
    if (daysEstimate && createdAt) {
      const nowDate = new Date();
      if (daysEstimate > nowDate) {
        return daysEstimate;
      }
    }
    return undefined;
  }
  function handleDateChange(date) {
    if (!_.isEqual(date, daysEstimate)) {
      setDaysEstimate(date);
      toggleEdit();
      const updateInfo = {
        marketId,
        investibleId,
        daysEstimate: date,
      };
      setOperationRunning(true);
      return updateInvestible(updateInfo).then((fullInvestible) => {
        refreshInvestibles(investiblesDispatch, diffDispatch, [fullInvestible]);
        const message = findMessageOfType('REPORT_REQUIRED', investibleId, messagesState);
        if (message) {
          messagesDispatch(removeMessage(message));
        }
        setOperationRunning(false);
      });
    }
  }
  const availableLabels = _.difference(labels, labelList);
  const defaultProps = {
    options: availableLabels,
    getOptionLabel: (option) => option,
  };

  function expansionChanged(event, expanded) {
    setChangeStagesExpanded(expanded);
  }

  function isEditableByUser() {
    return displayEdit;
  }

  function setReadyToStart(isReadyToStart) {
    const updateInfo = {
      marketId,
      investibleId,
      openForInvestment: isReadyToStart,
    };
    setOperationRunning(true);
    return updateInvestible(updateInfo).then((fullInvestible) => {
      onInvestibleStageChange(stage, fullInvestible, investibleId, marketId, undefined,
        undefined, investiblesDispatch, diffDispatch, marketStagesState, messagesState,
        messagesDispatch, [INVESTIBLE_SUBMITTED_TYPE]);
      if (isReadyToStart) {
        notify(myPresence.id, investibleId, INVESTIBLE_SUBMITTED_TYPE, YELLOW_LEVEL, investiblesState, market,
          messagesDispatch);
      }
      setOperationRunning(false);
    });
  }

  function mySetBeingEdited(isEdit, event) {
    if (!isEdit || lockedBy === userId || !_.isEmpty(lockedBy)) {
      // Either don't lock or throw the modal up - both of which InvestibleBodyEdit can handle
      return doSetEditWhenValid(isEdit, isEditableByUser,
        (value) => updatePageState({beingEdited: value, name}), event, history);
    }
    if (!isEditableByUser() || invalidEditEvent(event, history)) {
      return;
    }
    updatePageState({beingEdited: true, name});
    return pushMessage(LOCK_INVESTIBLE_CHANNEL, { event: LOCK_INVESTIBLE, marketId, investibleId });
  }
  function toggleReviewers() {
    navigate(history, `${formInvestibleEditLink(market.id, marketInvestible.investible.id)}#review=true`);
  }

  function toggleApprovers() {
    navigate(history, `${formInvestibleEditLink(market.id, marketInvestible.investible.id)}#approve=true`);
  }
  function createNavListItem(icon, textId, anchorId, howManyNum, alwaysShow) {
    return baseNavListItem(formInvestibleLink(marketId, investibleId), icon, textId, anchorId, howManyNum, alwaysShow);
  }
  const openComments = investmentReasonsRemoved.filter((comment) => !comment.resolved) || [];
  const closedComments = investmentReasonsRemoved.filter((comment) => comment.resolved) || [];
  const sortedClosedRoots = getSortedRoots(closedComments, searchResults);
  const { id: closedId } = getFakeCommentsArray(sortedClosedRoots)[0];
  const sortedRoots = getSortedRoots(openComments, searchResults);
  const blocking = sortedRoots.filter((comment) => comment.comment_type === ISSUE_TYPE);
  const { id: blockingId } = getFakeCommentsArray(blocking)[0];
  const questions = sortedRoots.filter((comment) => comment.comment_type === QUESTION_TYPE);
  const { id: questionId } = getFakeCommentsArray(questions)[0];
  const suggestions = sortedRoots.filter((comment) => comment.comment_type === SUGGEST_CHANGE_TYPE);
  const { id: suggestId } = getFakeCommentsArray(suggestions)[0];
  const reports = sortedRoots.filter((comment) => comment.comment_type === REPORT_TYPE);
  const { id: reportId } = getFakeCommentsArray(reports)[0];
  const todoSortedComments = sortedRoots.filter((comment) => comment.comment_type === TODO_TYPE);
  const { id: todoId } = getFakeCommentsArray(todoSortedComments)[0];
  const navigationMenu = {navHeaderIcon: AssignmentIcon,
    navListItemTextArray: [createNavListItem(EditIcon,'description_label', 'storyMain',
      _.isEmpty(search) || results.find((item) => item.id === investibleId) ? undefined : 0),
      createNavListItem(ThumbsUpDownIcon, 'approvals', 'approvals',
        _.isEmpty(search) ? _.size(invested) : _.size(investmentReasons),
        _.isEmpty(search) ? isInVoting : false),
      inArchives || !_.isEmpty(search) ? {} : createNavListItem(AddIcon,'commentAddBox'),
      createNavListItem(BlockIcon,'blocking', `c${blockingId}`, _.size(blocking)),
      createNavListItem(QuestionIcon, 'questions', `c${questionId}`, _.size(questions)),
      createNavListItem(UpdateIcon,'reports', `c${reportId}`, _.size(reports)),
      createNavListItem(ChangeSuggstionIcon,'suggestions', `c${suggestId}`, _.size(suggestions)),
      createNavListItem(ListAltIcon,'todoSection', `c${todoId}`, _.size(todoSortedComments)),
      createNavListItem(QuestionAnswer,'closedComments', `c${closedId}`, _.size(sortedClosedRoots))
    ]};

  return (
    <Screen
      title={ticketCode ? `${ticketCode} ${name}` : name}
      tabTitle={name}
      breadCrumbs={breadCrumbs}
      hidden={hidden}
      navigationOptions={navigationMenu}
    >
      {!inArchives && isInVoting && isAssigned && acceptedFull && (
        <DismissableText textId='planningInvestibleAcceptedFullHelp' />
      )}
      {!inArchives && isInAccepted && isAssigned && (
        <DismissableText textId='planningInvestibleAcceptedHelp' />
      )}
      {!yourVote && !inArchives && canVote && !isAssigned && (
        <DismissableText textId='planningInvestibleVotingHelp' />
      )}
      <Card id="storyMain" elevation={3}>
        <CardType
          className={classes.cardType}
          createdAt={createdAt}
          myBeingEdited={beingEdited}
        />
        <CardContent className={beingEdited ? classes.editCardContent : classes.votingCardContent}>
          <Grid container className={classes.mobileColumn}>
            <Grid className={classes.borderRight} item xs={2}>
              <dl className={classes.rolesRoot}>
                {market.id && marketInvestible.investible && (
                  <div className={classes.assignmentContainer}>
                    <FormattedMessage id="planningInvestibleAssignments" />
                    <div className={clsx(classes.group, classes.assignments)}>
                      <Assignments
                        classes={classes}
                        marketPresences={marketPresences}
                        assigned={assigned}
                        isAdmin={isAdmin}
                        toggleAssign={toggleAssign}
                        toolTipId="storyAddParticipantsLabel"
                        showMoveMessage
                      />
                    </div>
                  </div>
                )}
                {market.id && marketInvestible.investible && isReadyFurtherWork && (
                  <div className={classes.assignmentContainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={openForInvestment}
                          disabled={operationRunning || !isAdmin}
                          checked={openForInvestment}
                          onClick={() => {
                            if (!openForInvestment && openComments && !mobileLayout) {
                              setOpen(true);
                            } else {
                              setReadyToStart(!openForInvestment);
                            }
                          }}
                        />
                      }
                      label={intl.formatMessage({ id: 'readyToStartCheckboxExplanation' })}
                    />
                    {!openForInvestment && !mobileLayout && (
                      <WarningDialog
                        classes={lockedDialogClasses}
                        open={open}
                        onClose={() => setOpen(false)}
                        issueWarningId="unresolvedReadyToStartWarning"
                        /* slots */
                        actions={
                          <SpinningIconLabelButton onClick={() => setReadyToStart(true)}
                                                   icon={SettingsBackupRestore}
                                                   id="issueProceedReadyToStartButton">
                            {intl.formatMessage({ id: 'issueProceed' })}
                          </SpinningIconLabelButton>
                        }
                      />
                    )}
                  </div>
                )}
                {!_.isEmpty(investibleCollaborators) && (
                  <div className={classes.assignmentContainer}>
                    <FormattedMessage id="collaborators" />
                    <div className={clsx(classes.group, classes.assignments)}>
                      <Assignments
                        classes={classes}
                        marketPresences={marketPresences}
                        assigned={investibleCollaborators}
                        isAdmin={false}
                        toggleAssign={() => {}}
                        toolTipId="collaborators"
                      />
                    </div>
                  </div>
                )}
                {market.id && marketInvestible.investible && (isInVoting || isInReview) && (
                  <div className={classes.assignmentContainer}>
                    <FormattedMessage id={isInVoting ? 'requiredApprovers': 'requiredReviewers'} />
                    <div className={clsx(classes.group, classes.assignments)}>
                      <Assignments
                        classes={classes}
                        marketPresences={marketPresences}
                        assigned={isInVoting ? requiredApprovers : requiredReviewers}
                        isAdmin={isAdmin}
                        toggleAssign={isInVoting ? toggleApprovers : toggleReviewers}
                        toolTipId={isInVoting ? 'storyApproversLabel' : 'storyReviewersLabel'}
                      />
                    </div>
                  </div>
                )}
              </dl>
            </Grid>
            <Grid item xs={8} className={!beingEdited && isEditableByUser() ? classes.fullWidthEditable :
              classes.fullWidth}
                  onClick={(event) => !beingEdited && mySetBeingEdited(true, event)}>
              {lockedBy && myPresence.id !== lockedBy && isEditableByUser() && (
                <Typography>
                  {intl.formatMessage({ id: "lockedBy" }, { x: lockedByName })}
                </Typography>
              )}
              {marketId && investibleId && (
                <InvestibleBodyEdit
                  hidden={hidden}
                  marketId={marketId}
                  userId={userId}
                  investibleId={investibleId}
                  pageState={pageState}
                  pageStateUpdate={updatePageState}
                  pageStateReset={pageStateReset}
                  fullInvestible={marketInvestible}
                  setBeingEdited={mySetBeingEdited} beingEdited={beingEdited}
                  isEditableByUser={isEditableByUser}/>
              )}
            </Grid>
            <Grid className={classes.borderLeft} item xs={2}>
              <div className={classes.editRow}>
                {mobileLayout && !inMarketArchives && isEditableByUser() && !beingEdited && (
                  <div>
                    <EditMarketButton
                      labelId="edit"
                      marketId={marketId}
                      onClick={(event) => mySetBeingEdited(true, event)}
                    />
                  </div>
                )}
                {displayEdit && !inMarketArchives && !isInVoting && (
                  <div>
                    <EditMarketButton
                      labelId="changeCompletionDate"
                      marketId={marketId}
                      onClick={toggleEdit}
                      icon={<EventIcon htmlColor={ACTION_BUTTON_COLOR} />}
                    />
                    {showDatepicker && (
                      <div className={classes.datePicker}>
                        <DatePicker
                          placeholderText={intl.formatMessage({ id: "selectDate" })}
                          selected={getStartDate()}
                          onChange={handleDateChange}
                          popperPlacement="top"
                          minDate={new Date()}
                          inline
                          onClickOutside={toggleEdit}
                        />
                      </div>
                    )}
                  </div>
                )}
                <div style={{paddingLeft: "1rem", paddingRight: "1rem"}}>
                  <ShareStoryButton investibleId={investibleId} marketId={marketId} />
                </div>
              </div>
              {marketDaysEstimate && !isInVoting && (
                <DaysEstimate readOnly value={daysEstimate} />
              )}
              <MarketMetaData
                stage={stage}
                stageName={fullStage.name}
                investibleId={investibleId}
                market={market}
                marketInvestible={marketInvestible}
                isAdmin={isAdmin && !inArchives}
                stageActions={getStageActions()}
                expansionChanged={expansionChanged}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                inArchives={inArchives}
                isAssigned={isAssigned}
                blockingComments={blockingComments}
                todoComments={todoComments}
                isInVoting={isInVoting}
                acceptedFull={acceptedFull}
                questionByAssignedComments={questionByAssignedComments}
                pageState={pageState}
                updatePageState={updatePageState}
                acceptedEmpty={assignedInAcceptedStage.length === 0}
                invested={invested}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.fullWidthCentered}>
            {labelList && labelList.map((label) =>
              <div key={label} className={classes.labelChip}>
                <Chip label={label} onDelete={()=>deleteLabel(`${label}`)} color="primary" />
              </div>
            )}
            {!inArchives && isAdmin && (
              <div className={classes.autocompleteContainer}>
                <Autocomplete
                  {...defaultProps}
                  id="addLabel"
                  key={clearMeHack}
                  freeSolo
                  renderInput={(params) => <TextField {...params}
                                                      label={intl.formatMessage({ id: 'addLabel' })}
                                                      margin="dense"
                                                      variant="outlined" />}
                  style={{ width: 150, maxHeight: '1rem' }}
                  onFocus={labelInputFocus}
                  onBlur={labelInputFocus}
                  onChange={labelInputOnChange}
                />
                {newLabel && (
                  <IconButton
                    className={classes.noPad}
                    onClick={addLabel}
                  >
                    <AddIcon htmlColor={ACTION_BUTTON_COLOR}/>
                  </IconButton>
                )}
                {!newLabel && labelFocus && !mobileLayout &&  (
                  <div className={classes.labelExplain} >
                    <Typography key="completeExplain" className={classes.explain}>
                      {intl.formatMessage({ id: 'typeOrChoose' })}
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </Grid>
        </CardContent>
      </Card>
      <h2 id="approvals">
        <FormattedMessage id="decisionInvestibleOthersVoting" />
      </h2>
      <Voting
        investibleId={investibleId}
        marketPresences={marketPresences}
        investmentReasons={investmentReasons}
        showExpiration={fullStage.has_expiration}
        expirationMinutes={market.investment_expiration * 1440}
        votingPageState={votingPageState}
        updateVotingPageState={updateVotingPageState}
        votingPageStateReset={votingPageStateReset}
        votingAllowed={canVote}
        yourPresence={yourPresence}
        market={market}
        isAssigned={isAssigned}
      />
      {displayVotingInput && investibleId && (
        <>
          {isAssigned && (
            <DismissableText textId="planningInvestibleCantVote" />
          )}
          <YourVoting
            investibleId={investibleId}
            marketPresences={marketPresences}
            comments={investmentReasons}
            userId={userId}
            market={market}
            votingPageState={votingPageState}
            updateVotingPageState={updateVotingPageState}
            votingPageStateReset={votingPageStateReset}
            isAssigned={isAssigned}
          />
          {!isAssigned && (
            <h3>{intl.formatMessage({ id: 'orStructuredComment' })}</h3>
          )}
          {isAssigned && (
            <div style={{paddingTop: '2rem'}} />
          )}
          {_.isEmpty(search) && marketId && !_.isEmpty(investible) && !hidden && (
            <CommentAddBox
              allowedTypes={allowedCommentTypes}
              investible={investible}
              marketId={marketId}
              issueWarningId={isReadyFurtherWork ? undefined : 'issueWarningPlanning'}
              todoWarningId={todoWarning}
              isInReview={isInReview}
              isAssignee={isAssigned}
              isStory
              numProgressReport={numProgressReport.length}
            />
          )}
        </>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ marginTop: '15px' }}>
          {!inArchives && !isInNotDoing && !isInVerified && (!isInVoting || !canVote || yourVote) && _.isEmpty(search)
          && marketId && !_.isEmpty(investible) && !hidden && (
            <CommentAddBox
              allowedTypes={allowedCommentTypes}
              investible={investible}
              marketId={marketId}
              issueWarningId={isReadyFurtherWork ? undefined : 'issueWarningPlanning'}
              todoWarningId={todoWarning}
              isInReview={isInReview}
              isAssignee={isAssigned}
              isStory
              numProgressReport={numProgressReport.length}
            />
          )}
          <CommentBox
            comments={investmentReasonsRemoved}
            marketId={marketId}
            allowedTypes={allowedCommentTypes}
          />
        </Grid>
      </Grid>
    </Screen>
  );
}

PlanningInvestible.propTypes = {
  market: PropTypes.object.isRequired,
  marketInvestible: PropTypes.object.isRequired,
  marketPresences: PropTypes.arrayOf(PropTypes.object),
  investibleComments: PropTypes.arrayOf(PropTypes.object),
  investibles: PropTypes.arrayOf(PropTypes.object),
  investibleId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
  inArchives: PropTypes.bool,
  hidden: PropTypes.bool
};

PlanningInvestible.defaultProps = {
  marketPresences: [],
  investibleComments: [],
  investibles: [],
  isAdmin: false,
  inArchives: false,
  hidden: false
};

export const useMetaDataStyles = makeStyles(
  theme => {
    return {
      root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: 'column',
        width: '100%',
        '& > div': {
          borderRadius: '6px',
          marginBottom: '1rem'
        }
      },
      flexRow: {
        flexDirection: 'row'
      },
      group: {
        backgroundColor: '#ecf0f1',
        borderRadius: 6,
        display: "flex",
        flexDirection: "row",
        padding: theme.spacing(1, 1),
        "&:first-child": {
          marginLeft: 0
        },
        [theme.breakpoints.down("sm")]: {
          backgroundColor: '#fff',
        }
      },
      expiration: {
        "& dd": {
          alignItems: "center",
          display: "flex",
          flex: "1 auto",
          flexDirection: "row",
          fontWeight: "bold",
          [theme.breakpoints.down('sm')]: {
            margin: 0,
          },
          
        }
      },
      blue: {
        backgroundColor: '#2d9cdb',
      },
      expansionControl: {
        backgroundColor: '#ecf0f1',
        width: '100%'
      },
      fontControl: {
        alignItems: "center",
        textTransform: 'capitalize',
        marginRight: 'auto',
        marginLeft: '5px',
        fontWeight: 700
      },
      expirationProgress: {
        marginRight: theme.spacing(1)
      },
      assignments: {
        padding: 0,
        "& ul": {
          flex: 4,
          margin: 0,
          padding: 0
        },
        "& li": {
          display: "inline-flex",
          fontWeight: "bold",
          marginLeft: theme.spacing(1)
        }
      },
      assignmentContainer: {
        width: '100%',
        textTransform: 'capitalize'
      },
      assignIconContainer: {
        display: 'flex',
        justifyContent: 'center'
      },
      assignmentFlexRow: {
        width: '100%',
        display: 'flex',
        padding: '8px'
      },
      flex1: {
        flex: 1
      },
      noPad: {
        padding: 0
      },
      menuButton: {
        width: '100%',
        padding: '12px'
      },
      linkContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      },
      scrollContainer: {
        maxHeight: '210px',
        overflow: 'auto'
      },
      outerBorder: {
        border: '1px solid black',
        borderRadius: '6px 6px 0 0'
      },
    }
  },
  { name: "MetaData" }
);

function MarketMetaData(props) {
  const {
    market,
    marketInvestible,
    investibleId,
    isAdmin,
    stageActions,
    expansionChanged,
    stage,
    stageName,
    anchorEl,
    setAnchorEl,
    inArchives,
    isAssigned,
    blockingComments,
    todoComments,
    isInVoting,
    acceptedFull,
    acceptedEmpty,
    invested,
    questionByAssignedComments,
    pageState, updatePageState
  } = props;

  const {
    showDiff
  } = pageState;

  let stageLabel;
  switch (stageName) {
    case 'In Dialog':
      stageLabel = 'planningInvestibleToVotingLabel';
      break;
    case 'Verified':
      stageLabel = 'planningInvestibleMoveToVerifiedLabel';
      break;
    case 'Not Doing':
      stageLabel = 'planningInvestibleMoveToNotDoingLabel';
      break;
    case 'In Review':
      stageLabel = 'planningInvestibleNextStageInReviewLabel';
      break;
    case 'Further Work':
      stageLabel = 'planningInvestibleMoveToFurtherWorkLabel';
      break;
    case 'Accepted':
      stageLabel = 'planningInvestibleNextStageAcceptedLabel';
      break;
    case 'Requires Input':
      stageLabel = 'requiresInputStageLabel';
      break;
    case 'Blocked':
      stageLabel = 'planningBlockedStageLabel'
      break;
    default:
      stageLabel = 'changeStage'
  }
  const [, investiblesDispatch] = useContext(InvestiblesContext);
  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const [diffState, diffDispatch] = useContext(DiffContext);
  const [messagesState, messagesDispatch] = useContext(NotificationsContext);
  const myMessage = findMessageOfTypeAndId(investibleId, messagesState);
  const diff = getDiff(diffState, investibleId);
  const classes = useMetaDataStyles();
  const attachedFiles = marketInvestible.investible && marketInvestible.investible.attached_files;

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
    expansionChanged(true);
  }

  function handleClose() {
    setAnchorEl(null);
    expansionChanged(false)
  }

  function onDeleteFile(path) {
    return deleteAttachedFilesFromInvestible(market.id, investibleId, [path])
      .then((investible) => {
        addInvestible(investiblesDispatch, diffDispatch, investible);
        return EMPTY_SPIN_RESULT;
      });
  }

  function onAttachFiles(metadatas) {
    return attachFilesToInvestible(market.id, investibleId, metadatas)
      .then((investible) => addInvestible(investiblesDispatch, diffDispatch, investible));
  }

  function toggleDiffShow() {
    if (showDiff) {
      markDiffViewed(diffDispatch, investibleId);
    }
    updatePageState({showDiff: !showDiff});
  }

  return (
    <dl className={classes.root}>
      {!_.isEmpty(stageActions) &&
      (
        <React.Fragment>
          <div style={{paddingTop: '0.5rem', marginTop: '0.5rem'}}>
            <FormattedMessage id="changeStage"/>
          </div>
          {!inArchives && isAssigned && (
              <MoveToNextVisibleStageActionButton
                key="visible"
                investibleId={investibleId}
                marketId={market.id}
                currentStageId={stage}
                disabled={!_.isEmpty(blockingComments) || (isInVoting && (!isAssigned || acceptedFull))}
                iconColor={isInVoting && _.size(invested) > 0 && acceptedEmpty ? HIGHLIGHTED_BUTTON_COLOR : undefined}
                acceptedStageAvailable={!acceptedFull}
                hasTodos={!_.isEmpty(todoComments)}
                hasAssignedQuestions={!_.isEmpty(questionByAssignedComments)}
              />
          )}
          <div className={classes.expansionControl} onChange={expansionChanged}>
            <Button
              className={classes.menuButton}
              endIcon={<ExpandMoreIcon style={{ marginRight: '16px' }} htmlColor={ACTION_BUTTON_COLOR}/>}
              aria-controls="stages-content"
              id="stages-header"
              onClick={handleClick}
            >
              <div className={classes.fontControl}>
                <FormattedMessage id={stageLabel}/>
              </div>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              {stageActions}
            </Menu>
          </div>
        </React.Fragment>
      )}
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
        </>
      )}
      {myMessage && diff && (
        <>
          <div style={{paddingTop: '0.5rem'}} />
          <SpinningIconLabelButton icon={showDiff ? ExpandLess : ExpandMoreIcon}
                                   onClick={toggleDiffShow} doSpin={false}>
            <FormattedMessage id={showDiff ? 'diffDisplayDismissLabel' : 'diffDisplayShowLabel'} />
          </SpinningIconLabelButton>
        </>
      )}
      <div style={{paddingTop: '1rem'}} />
      <AttachedFilesList
        marketId={market.id}
        onUpload={onAttachFiles}
        isAdmin={isAdmin}
        onDeleteClick={onDeleteFile}
        attachedFiles={attachedFiles}/>
    </dl>
  );
}

MarketMetaData.propTypes = {
  investibleId: PropTypes.string.isRequired,
  market: PropTypes.object.isRequired,
  marketInvestible: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  stageActions: PropTypes.array,
  expansionChanged: PropTypes.func.isRequired
}

function Assignments(props) {
  const { marketPresences, isAdmin, toggleAssign, classes, assigned, showMoveMessage, toolTipId } = props;
  const intl = useIntl();
  const myPresence = marketPresences.find((presence) => presence.current_user);
  const isFollowing = myPresence && myPresence.following;
  const safeAssigned = assigned || [];
  const presences = safeAssigned.map((userId) => {
    const presence = marketPresences.find(presence => presence.id === userId)
    if (!presence) {
      return { name : 'Removed', id: null }
    }
    return presence
  });
  // sort all removed last, then by name
  const sortedAssigned = _.sortBy(presences, [((presence) => presence.id? 0 : 1), (presence) => presence.name]);
  return (
    <span className={classes.assignmentFlexRow}>
      <ul>
        {_.isEmpty(sortedAssigned) && showMoveMessage && (
          <Typography key="unassigned" component="li">
            {intl.formatMessage({ id: 'reassignToMove' })}
          </Typography>
        )}
        {sortedAssigned.map((presence, index) => {
          return (
            <div
              style={{ display: 'flex', alignItems: 'center', paddingTop: `${index > 0 ? '0.5rem' : 0}` }}
              key={`${presence.id}${toolTipId}`}
            >
              <Gravatar email={presence.email} name={presence.name}/>
              <Typography component="li">
                {presence.name}
              </Typography>
            </div>
          );
        })}
      </ul>
      <div className={classes.flex1}>
        {isAdmin && isFollowing && (
          <div className={classes.assignIconContainer}>
            <Tooltip
              title={intl.formatMessage({ id: toolTipId })}
            >
              <IconButton
                className={classes.noPad}
                onClick={toggleAssign}
              >
                <PersonAddIcon htmlColor={ACTION_BUTTON_COLOR}/>
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </span>
  );
}

export default PlanningInvestible;
