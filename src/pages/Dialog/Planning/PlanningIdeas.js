import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useHistory } from 'react-router';
import { Grid, Link, Tooltip, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { yellow } from '@material-ui/core/colors';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import {
  formInvestibleLink,
  formMarketAddInvestibleLink,
  navigate,
  preventDefaultAndProp
} from '../../../utils/marketIdPathFunctions'
import clsx from 'clsx';
import {
  checkInProgressWarning,
  countByType,
} from './PlanningDialog';
import { DaysEstimate } from '../../../components/AgilePlan';
import {
  getMarketPresences,
  removeInvestibleInvestments
} from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext';
import Chip from '@material-ui/core/Chip';
import { stageChangeInvestible, updateInvestible } from '../../../api/investibles';
import {
  getInvestible,
  refreshInvestibles
} from '../../../contexts/InvestibesContext/investiblesContextHelper';
import { InvestiblesContext } from '../../../contexts/InvestibesContext/InvestiblesContext';
import { DiffContext } from '../../../contexts/DiffContext/DiffContext';
import { getMarketInfo } from '../../../utils/userFunctions';
import { ISSUE_TYPE, QUESTION_TYPE, SUGGEST_CHANGE_TYPE, TODO_TYPE } from '../../../constants/comments';
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext';
import { MarketsContext } from '../../../contexts/MarketsContext/MarketsContext';
import { getMarket } from '../../../contexts/MarketsContext/marketsContextHelper';
import { getFullStage, getStages } from '../../../contexts/MarketStagesContext/marketStagesContextHelper';
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext';
import { CommentsContext } from '../../../contexts/CommentsContext/CommentsContext';
import { removeHeader, restoreHeader } from '../../../containers/Header'
import { LocalPlanningDragContext } from './InvestiblesByWorkspace';
import GravatarGroup from '../../../components/Avatars/GravatarGroup';
import { getInvestibleVoters } from '../../../utils/votingUtils';
import { doRemoveEdit, doShowEdit, getCommenterPresences, getUserSwimlaneInvestibles, onDropTodo } from './userUtils'
import { NotificationsContext } from '../../../contexts/NotificationsContext/NotificationsContext'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { onInvestibleStageChange } from '../../../utils/investibleFunctions'

const usePlanningIdStyles = makeStyles(
  theme => {
    return {
      stages: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 0,
        '& > *': {
          borderRight: `1px solid ${theme.palette.grey['300']}`,
          flex: '1 1 25%',
          minWidth: '15ch',
          padding: theme.spacing(1),
          '&:last-child': {
            borderRight: 'none'
          }
        }
      },
      stageLabel: {},
      containerEmpty: {},
      containerRed: {
        borderColor: 'red',
        borderStyle: 'dashed',
        borderWidth: '3px',
        borderRadius: 6
      },
      containerGreen: {
        borderColor: 'green',
        borderStyle: 'dashed',
        borderWidth: '3px',
        borderRadius: 6
      }
    };
  },
  { name: 'PlanningIdea' }
);

function PlanningIdeas(props) {
  const {
    investibles,
    marketId,
    acceptedStage,
    inDialogStageId,
    inReviewStageId,
    inBlockingStageId,
    inVerifiedStageId,
    inRequiresInputStageId,
    presenceId,
    activeMarket,
    comments
  } = props;
  const intl = useIntl();
  const acceptedStageId = acceptedStage.id;
  const classes = usePlanningIdStyles();
  const [marketPresencesState, marketPresencesDispatch] = useContext(MarketPresencesContext);
  const [marketsState] = useContext(MarketsContext);
  const [marketStagesState] = useContext(MarketStagesContext);
  const [beingDraggedHack, setBeingDraggedHack] = useContext(LocalPlanningDragContext);
  const market = getMarket(marketsState, marketId);
  // investibles for type initiative, are really markets, so treat it as such
  const { votes_required: votesRequired } = (market || {});
  const [invState, invDispatch] = useContext(InvestiblesContext);
  const [operationRunning, setOperationRunning] = useContext(OperationInProgressContext);
  const [commentsState, commentsDispatch] = useContext(CommentsContext);
  const [, diffDispatch] = useContext(DiffContext);
  const marketPresences = getMarketPresences(marketPresencesState, marketId);
  const myPresence = (marketPresences || []).find((presence) => presence.current_user) || {};
  const [messagesState, messagesDispatch] = useContext(NotificationsContext);
  const warnAccepted = checkInProgressWarning(investibles, myPresence, messagesState);
  const acceptedInvestibles = investibles.filter(investible => {
    const { market_infos: marketInfos } = investible;
    const marketInfo = marketInfos.find(info => info.market_id === marketId);
    return marketInfo !== undefined && marketInfo.stage === acceptedStageId;
  }) || [];
  const acceptedFull = acceptedStage.allowed_investibles > 0
    && acceptedInvestibles.length >= acceptedStage.allowed_investibles;
  const acceptedStageLabel = acceptedFull ? 'planningAcceptedStageFullLabel' : 'planningAcceptedStageLabel';

  function isBlockedByTodo(investibleId, currentStageId, targetStageId) {
    const investibleComments = comments.filter((comment) => comment.investible_id === investibleId) || [];
    const todoComments = investibleComments.filter(
      comment => comment.comment_type === TODO_TYPE && !comment.resolved
    );
    return targetStageId === inVerifiedStageId && !_.isEmpty(todoComments);
  }

  function stageChange (event, targetStageId) {
    event.preventDefault();
    const investibleId = event.dataTransfer.getData('text');
    const currentStageId = event.dataTransfer.getData('stageId');
    if (!operationRunning && !isBlockedByTodo(investibleId, currentStageId, targetStageId) &&
      currentStageId !== targetStageId && checkStageMatching(currentStageId)) {
      const target = event.target;
      target.style.cursor = 'wait';
      const moveInfo = {
        marketId,
        investibleId,
        stageInfo: {
          current_stage_id: currentStageId,
          stage_id: targetStageId,
        },
      };
      setOperationRunning(true);
      return stageChangeInvestible(moveInfo)
        .then((inv) => {
          onInvestibleStageChange(targetStageId, inv, investibleId, marketId, commentsState, commentsDispatch,
            invDispatch, diffDispatch, marketStagesState, messagesState, messagesDispatch);
        }).finally(() => {
          target.style.cursor = 'pointer';
          setOperationRunning(false);
        });
    }
  }

  function isAssignedInvestible (event, assignedToId) {
    const investibleId = event.dataTransfer.getData('text');
    const investible = getInvestible(invState, investibleId);
    const marketInfo = getMarketInfo(investible, marketId);
    const { assigned } = marketInfo;
    return (assigned || []).includes(assignedToId);
  }

  function checkStageMatching (stageId) {
    const marketStages = getStages(marketStagesState, marketId);
    const stage = getFullStage(marketStagesState, marketId, stageId);
    return (marketStages || []).includes(stage);
  }

  function onDropVoting (event) {
    const currentStageId = event.dataTransfer.getData('stageId');
    if (!currentStageId) {
      // This is a dragged TODO
      const commentId = event.dataTransfer.getData('text');
      onDropTodo(commentId, commentsState, marketId, setOperationRunning, intl, commentsDispatch, invDispatch,
        presenceId);
    } else if (checkStageMatching(currentStageId)) {
      const investibleId = event.dataTransfer.getData('text');
      if (isAssignedInvestible(event, presenceId)) {
        stageChange(event, inDialogStageId);
      } else if (!operationRunning && !isAssignedInvestible(event, presenceId)) {
        // Assignment can be changed at any time to anyone not already assigned when moving into voting
        const assignments = [presenceId];
        const updateInfo = {
          marketId,
          investibleId,
          assignments,
        };
        setOperationRunning(true);
        updateInvestible(updateInfo)
          .then((fullInvestible) => {
            const { market_infos: marketInfos } = fullInvestible;
            const marketInfo = marketInfos.find(info => info.market_id === marketId);
            const investibleComments = comments.filter((comment) => comment.investible_id === investibleId
              && !comment.resolved) || [];
            const blockingComments = investibleComments.filter(comment => comment.comment_type === ISSUE_TYPE);
            const assignedInputComments = investibleComments.filter(
              comment => (comment.comment_type === QUESTION_TYPE || comment.comment_type === SUGGEST_CHANGE_TYPE)
                && marketInfo.assigned.includes(comment.created_by)
            );
            marketInfo.stage = !_.isEmpty(blockingComments) ? inBlockingStageId :
              _.isEmpty(assignedInputComments) ? inDialogStageId : inRequiresInputStageId;
            refreshInvestibles(invDispatch, diffDispatch, [fullInvestible]);
            removeInvestibleInvestments(marketPresencesState, marketPresencesDispatch, marketId, investibleId);
            setOperationRunning(false);
          });
      }
    }
  }

  function onDropAccepted (event) {
    const investibleId = event.dataTransfer.getData('text');
    const currentStageId = event.dataTransfer.getData('stageId');
    if (checkStageMatching(currentStageId)) {
      const investible = getInvestible(invState, investibleId);
      const marketInfo = getMarketInfo(investible, marketId);
      const { assigned } = marketInfo;
      if ((assigned || []).length === 1) {
        // Not supporting drag and drop to accepted for multiple assigned
        if (isAssignedInvestible(event, myPresence.id) && myPresence.id === presenceId && !acceptedFull) {
          stageChange(event, acceptedStageId);
        }
      }
    }
  }

  function onDropReview (event) {
    const currentStageId = event.dataTransfer.getData('stageId');
    if (checkStageMatching(currentStageId)) {
      if (isAssignedInvestible(event, presenceId)) {
        stageChange(event, inReviewStageId);
      }
    }
  }

  function onDropVerified(event) {
    const currentStageId = event.dataTransfer.getData('stageId');
    if (checkStageMatching(currentStageId)) {
      stageChange(event, inVerifiedStageId);
    }
  }

  function isEligableDrop(divId) {
    const { id, stageId } = beingDraggedHack;
    if (!stageId) {
      // This is a TODO being dragged
      return divId === inDialogStageId;
    }
    if (!checkStageMatching(stageId)) {
      return false;
    }
    const investible = getInvestible(invState, id);
    const marketInfo = getMarketInfo(investible, marketId);
    const { assigned } = marketInfo;
    const draggerIsAssigned = (assigned || []).includes(myPresence.id);
    const swimLaneIsAssigned = (assigned || []).includes(presenceId);
    const isBlocked = isBlockedByTodo(id, stageId, divId);
    if (isBlocked) {
      return false;
    }
    if (divId === inDialogStageId || divId === inVerifiedStageId) {
      return true;
    }
    if (divId === acceptedStageId) {
      if ((assigned || []).length === 1) {
        // Not supporting drag and drop to accepted for multiple assigned
        return draggerIsAssigned && myPresence.id === presenceId && !acceptedFull;
      }
    }
    if (divId === inReviewStageId) {
      return swimLaneIsAssigned;
    }
    return false;
  }

  function onDragEnterStage (event, divId, divPresenceId) {
    removeHeader();
    const { id, stageId, previousElementId, originalElementId } = beingDraggedHack;
    const elementId = `${divId}_${divPresenceId}`;
    if (elementId !== originalElementId && elementId !== previousElementId) {
      if (previousElementId) {
        document.getElementById(previousElementId).className = classes.containerEmpty;
      }
      if (isEligableDrop(divId)) {
        if (!operationRunning) {
          document.getElementById(elementId).className = classes.containerGreen;
          if (!_.isEmpty(beingDraggedHack)) {
            setBeingDraggedHack({ id, stageId, previousElementId: elementId, originalElementId });
          }
        }
      } else {
        event.dataTransfer.dropEffect = 'none';
        document.getElementById(elementId).className = classes.containerRed;
        if (!_.isEmpty(beingDraggedHack)) {
          setBeingDraggedHack({ id, stageId, previousElementId: elementId, originalElementId });
        }
      }
    }
  }

  function onDragEndStage () {
    restoreHeader();
    const { previousElementId } = beingDraggedHack;
    if (previousElementId) {
      document.getElementById(previousElementId).className = classes.containerEmpty;
      setBeingDraggedHack({});
    }
  }

  function onDragOverProcess(event) {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
  }

  return (
    <dl className={classes.stages}>
      <div id={`${inDialogStageId}_${presenceId}`} onDrop={onDropVoting}
           onDragOver={onDragOverProcess}
           onDragEnter={(event) => onDragEnterStage(event, inDialogStageId, presenceId)}
           onDragEnd={onDragEndStage}>
        <Tooltip
          title={intl.formatMessage({ id: 'planningVotingStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id="planningVotingStageLabel"/>
          </dt>
        </Tooltip>
        <VotingStage
          className={classes.stage}
          id={inDialogStageId}
          investibles={investibles}
          marketId={marketId}
          presenceId={presenceId}
          activeMarket={activeMarket}
          isAdmin={myPresence.is_admin}
          marketPresences={marketPresences}
          comments={comments}
          votesRequired={votesRequired}
        />
      </div>
      <div id={`${acceptedStageId}_${presenceId}`} onDrop={onDropAccepted}
           onDragOver={onDragOverProcess}
           onDragEnter={(event) => onDragEnterStage(event, acceptedStageId, presenceId)}
           onDragEnd={onDragEndStage}>
        <Tooltip
          title={intl.formatMessage({ id: 'planningAcceptedStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id={acceptedStageLabel}/>
          </dt>
        </Tooltip>
        <AcceptedStage
          className={classes.stage}
          id={acceptedStageId}
          investibles={investibles}
          marketId={marketId}
          presenceId={presenceId}
          marketPresences={marketPresences}
          comments={comments}
          warnAccepted={warnAccepted}
        />
      </div>
      <div id={`${inReviewStageId}_${presenceId}`} onDrop={onDropReview}
           onDragOver={onDragOverProcess}
           onDragEnter={(event) => onDragEnterStage(event, inReviewStageId, presenceId)}
           onDragEnd={onDragEndStage}>
        <Tooltip
          title={intl.formatMessage({ id: 'planningReviewStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id="planningReviewStageLabel"/>
          </dt>
        </Tooltip>
        <ReviewStage
          className={classes.stage}
          id={inReviewStageId}
          investibles={investibles}
          marketId={marketId}
          presenceId={presenceId}
          comments={comments}
          marketPresences={marketPresences}
        />
      </div>
      <div id={`${inVerifiedStageId}_${presenceId}`} onDrop={onDropVerified}
           onDragOver={onDragOverProcess}
           onDragEnter={(event) => onDragEnterStage(event, inVerifiedStageId, presenceId)}
           onDragEnd={onDragEndStage}>
        <Tooltip
          title={intl.formatMessage({ id: 'planningVerifiedStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id="verifiedBlockedStageLabel"/>
          </dt>
        </Tooltip>
        <VerifiedStage
          className={classes.stage}
          id={inVerifiedStageId}
          investibles={investibles}
          stage={getFullStage(marketStagesState, marketId, inVerifiedStageId)}
          presenceId={presenceId}
          comments={comments}
          marketPresences={marketPresences}
          marketId={marketId}
        />
      </div>
    </dl>
  );
}

PlanningIdeas.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
  investibles: PropTypes.arrayOf(PropTypes.object),
  marketId: PropTypes.string.isRequired,
  acceptedStage: PropTypes.object.isRequired,
  inDialogStageId: PropTypes.string.isRequired,
  inReviewStageId: PropTypes.string.isRequired,
  inBlockingStageId: PropTypes.string.isRequired,
  presenceId: PropTypes.string.isRequired
};

PlanningIdeas.defaultProps = {
  investibles: [],
  comments: []
};

const useStageClasses = makeStyles(
  theme => {
    return {
      fallbackRoot: {
        fontSize: '.8em',
        color: 'red',
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1, 2),
        overflowWrap: 'break-word'
      },
      verifiedOverflow: {
        overflowY: 'auto',
        maxHeight: '25rem'
      },
      root: {
        border: `1px solid ${theme.palette.grey['400']}`,
        borderRadius: theme.spacing(1),
        fontSize: '.8em',
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1, 2),
        overflowWrap: 'break-word'
      },
      rootWarnAccepted: {
        border: `1px solid ${theme.palette.grey['400']}`,
        borderRadius: theme.spacing(1),
        fontSize: '.8em',
        margin: theme.spacing(0.5, 0),
        padding: theme.spacing(1, 2),
        backgroundColor: yellow['400'],
        overflowWrap: 'break-word',
        overflowX: 'hidden'
      },
      outlinedAccepted: {
        border: `1px solid ${theme.palette.grey['400']}`,
        borderRadius: theme.spacing(1),
        fontSize: '.8em',
        margin: theme.spacing(0.5, 0),
        padding: theme.spacing(1, 2),
        overflowWrap: 'break-word',
        overflowX: 'hidden'
      },
      regularAccepted: {
        marginLeft: 0,
        overflowWrap: 'break-word',
        overflowX: 'hidden'
      },
      list: {
        listStyle: 'none',
        margin: 0,
        padding: 0
      }
    };
  },
  { name: 'Stage' }
);

function Stage (props) {
  const {
    fallbackOnClick,
    comments,
    fallbackWarning,
    id,
    investibles,
    marketId,
    updatedText,
    warnAccepted,
    isReview,
    isVoting,
    showCompletion,
    marketPresences,
    presenceId,
    limitInvestibles,
    limitInvestiblesAge,
    votesRequired
  } = props;
  const theme = useTheme();
  const mobileLayout = useMediaQuery(theme.breakpoints.down('sm'));
  const [, dragHack] = useContext(LocalPlanningDragContext);
  const stageInvestibles = getUserSwimlaneInvestibles(investibles, limitInvestibles, limitInvestiblesAge,
    marketId, id);
  const sortedInvestibles = stageInvestibles.sort(function(a, b) {
    const aMarketInfo = getMarketInfo(a, marketId);
    const bMarketInfo = getMarketInfo(b, marketId);
    return new Date(bMarketInfo.updated_at) - new Date(aMarketInfo.updated_at);
  });
  const classes = useStageClasses(props);
  const history = useHistory();
  if (fallbackWarning !== undefined && stageInvestibles.length === 0) {
    const style = fallbackOnClick ? { cursor: 'pointer' } : {};
    return (
      <div onClick={fallbackOnClick ? fallbackOnClick : () => {}} style={style}>
        <dd className={classes.fallbackRoot}>
          {fallbackWarning}
        </dd>
      </div>
    );
  }

  function investibleOnDragStart (event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text', event.target.id);
    event.dataTransfer.setData('stageId', id);
    const originalElementId = `${id}_${presenceId}`;
    dragHack({ id: event.target.id, stageId: id, originalElementId });
  }

  const warnAcceptedSafe = warnAccepted || {};
  const singleInvestible = (stageInvestibles || []).length === 1;

  return (
    <dd className={singleInvestible && warnAcceptedSafe[stageInvestibles[0].investible.id] ?
      classes.rootWarnAccepted : singleInvestible ? classes.root : classes.regularAccepted}>
      <ul className={classes.list}>
        <Grid
          className={classes.verifiedOverflow}
          container>
        {sortedInvestibles.map(inv => {
          const { investible, market_infos: marketInfos } = inv;
          const marketInfo = marketInfos.find(
            info => info.market_id === marketId
          );

          return (
            <Grid key={investible.id} item xs={12} onDragStart={investibleOnDragStart} id={investible.id} draggable
                  className={!singleInvestible && warnAcceptedSafe[investible.id] ? classes.rootWarnAccepted
              : !singleInvestible ? classes.outlinedAccepted : classes.regularAccepted}
                  onMouseOver={() => doShowEdit(investible.id)} onMouseOut={() => doRemoveEdit(investible.id,
              isVoting || isReview)}
                  onClick={event => {
                    preventDefaultAndProp(event);
                    navigate(history, formInvestibleLink(marketId, investible.id));
                  }}
            >
                <StageInvestible
                  marketPresences={marketPresences || []}
                  comments={comments || []}
                  investible={investible}
                  marketId={marketId}
                  marketInfo={marketInfo}
                  updatedText={updatedText}
                  isReview={isReview}
                  isVoting={isVoting}
                  votesRequired={votesRequired}
                  numTodos={countByType(investible, comments, [TODO_TYPE])}
                  showWarning={isReview || isVoting ? countByType(investible, comments,
                    [QUESTION_TYPE, SUGGEST_CHANGE_TYPE]) > 0 : false}
                  showCompletion={showCompletion}
                  mobileLayout={mobileLayout}
                />
            </Grid>
          );
        })}
        </Grid>
      </ul>
    </dd>
  );
}

Stage.propTypes = {
  id: PropTypes.string.isRequired,
  investibles: PropTypes.array.isRequired,
  marketId: PropTypes.string.isRequired,
  fallbackOnClick: PropTypes.func
};

function VotingStage (props) {
  const { className, marketId, presenceId, activeMarket, isAdmin, comments, marketPresences, votesRequired, ...other }
    = props;
  const intl = useIntl();

  const history = useHistory();
  const link = formMarketAddInvestibleLink(marketId);
  const assignedLink = link + `#assignee=${presenceId}`;

  function onClick (event) {
    // prevent browser navigation
    event.stopPropagation();
    event.preventDefault();
    navigate(history, assignedLink);
  }

  return (

    <Stage
      fallbackWarning={
        activeMarket && isAdmin &&
            <StageLink href={assignedLink} onClick={onClick}>
              {intl.formatMessage({
                id: 'createAssignment'
              })}
            </StageLink>
      }
      marketId={marketId}
      comments={comments}
      presenceId={presenceId}
      isVoting
      fallbackOnClick={onClick}
      votesRequired={votesRequired}
      marketPresences={marketPresences}
      updatedText={intl.formatMessage({
        id: 'inDialogInvestiblesUpdatedAt'
      })}
      {...other}
    />
  );
}

function AcceptedStage (props) {
  const intl = useIntl();
  return (
    <Stage
      updatedText={intl.formatMessage({
        id: 'acceptedInvestiblesUpdatedAt'
      })}
      showCompletion
      {...props}
    />
  );
}

function ReviewStage (props) {
  const intl = useIntl();

  return (
    <Stage
      updatedText={intl.formatMessage({
        id: 'reviewingInvestiblesUpdatedAt'
      })}
      isReview
      {...props}
    />
  );
}

const generalStageStyles = makeStyles(() => {
  return {
    chipClass: {
      fontSize: 10,
    },
    chipsClass: {
      display: 'flex',
    },
    chipStyleRed: {
      backgroundColor: '#E85757',
      color: 'white'
    },
    chipStyleGreen: {
      backgroundColor: 'white',
      border: '0.5px solid grey'
    },
  };
});

function VerifiedStage(props) {
  const intl = useIntl();
  const { stage } = props;
  const limitInvestibles = (stage || {}).allowed_investibles;
  const limitInvestiblesAge = (stage || {}).days_visible;
  return (
    <Stage
      updatedText={intl.formatMessage({
        id: 'verifiedInvestiblesUpdatedAt'
      })}
      limitInvestibles={limitInvestibles}
      limitInvestiblesAge={limitInvestiblesAge}
      {...props}
    />
  );
}


function StageInvestible(props) {
  const {
    investible,
    marketId,
    marketInfo,
    updatedText,
    showWarning,
    showCompletion,
    comments,
    marketPresences,
    isVoting,
    votesRequired,
    isReview,
    numTodos,
    mobileLayout
  } = props;
  const intl = useIntl();

  function getChip(labelNum, isGreen, toolTipId) {
    if (mobileLayout) {
      return React.Fragment;
    }
    return (
      <Tooltip title={intl.formatMessage({ id: toolTipId })}>
        <Chip label={`${labelNum}`} size='small' className={isGreen ? classes.chipStyleGreen : classes.chipStyleRed} />
      </Tooltip>
    );
  }

  const { completion_estimate: daysEstimate, assigned } = marketInfo;
  const { id, name, created_at: createdAt, label_list: labelList } = investible;
  const history = useHistory();
  const to = formInvestibleLink(marketId, id);
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const classes = generalStageStyles();

  const commentsForInvestible = comments.filter((comment) => comment.investible_id === id);

  const commenterPresences = getCommenterPresences(marketPresences, commentsForInvestible, marketPresencesState);
  const votersForInvestible = getInvestibleVoters(marketPresences, id);
  const concated = [...votersForInvestible, ...commenterPresences];
  const hasDaysEstimate = showCompletion && daysEstimate;
  const collaboratorsForInvestible = _.uniqBy(concated, 'id');
  const votersNotAssigned = votersForInvestible.filter((voter) => !_.includes(assigned, voter.id)) || [];
  const votesRequiredDisplay = votesRequired > 0 ? votesRequired : 1;
  const enoughVotes = votersNotAssigned.length >= votesRequiredDisplay;
  const chip = isVoting ? getChip(votersNotAssigned.length, enoughVotes, 'approvalsCountExplanation')
    : isReview ? getChip(numTodos, numTodos === 0, 'todosCountExplanation') : undefined;
  return (
    <Grid container>
      <Grid item xs={10}>
        <Typography variant="inherit">
          {updatedText}
          <FormattedDate value={marketInfo.last_stage_change_date}/>
        </Typography>
        {hasDaysEstimate && !isVoting && (
          <DaysEstimate readOnly value={daysEstimate} createdAt={createdAt}/>
        )}
      </Grid>
      {chip && (
        <Grid item xs={1} style={{paddingBottom: '0.2rem'}}>
          {chip}
        </Grid>
      )}
      <Grid id={`showEdit0${id}`} item xs={1} style={{pointerEvents: 'none', display: 'none'}}>
        <EditOutlinedIcon style={{maxHeight: '1.25rem'}} />
      </Grid>
      <Grid id={`showEdit1${hasDaysEstimate ? '' : id}`} item xs={12} style={{paddingTop: `${chip ? '0rem' : '0.5rem'}`}}>
        <StageLink
          href={to}
          id={id}
          draggable="false"
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            navigate(history, to);
          }}
        >
          <Typography color={showWarning ? 'error' : 'initial'} variant="subtitle2">{name}</Typography>
          <div className={classes.chipsClass} style={{paddingTop: `${!_.isEmpty(labelList) ? '0.5rem': '0'}`}}>
            {labelList && labelList.map((label) =>
              <div key={label}>
                <Chip size="small" label={label} className={classes.chipClass} color="primary"/>
              </div>
            )}
          </div>
          <div style={{paddingTop: '0.5rem'}}>
            <GravatarGroup users={collaboratorsForInvestible}/>
          </div>
        </StageLink>
      </Grid>
    </Grid>
  );
}

const useStageLinkStyles = makeStyles(theme => {
  return {
    root: {
      color: 'inherit',
      display: 'block',
      height: '100%',
      width: '100%'
    }
  };
});

function StageLink (props) {
  const { className, ...other } = props;
  const classes = useStageLinkStyles();
  return <Link className={clsx(classes.root, className)} {...other} />;
}

export default PlanningIdeas;
