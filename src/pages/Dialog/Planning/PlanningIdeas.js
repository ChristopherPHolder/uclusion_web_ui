import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { Link, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { red, yellow } from '@material-ui/core/colors'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'
import { formInvestibleLink, formMarketAddInvestibleLink, navigate } from '../../../utils/marketIdPathFunctions'
import clsx from 'clsx'
import { checkInProgressWarning, checkReviewWarning, checkVotingWarning } from './PlanningDialog'
import { DaysEstimate } from '../../../components/AgilePlan'
import { getMarketPresences } from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext'
import Chip from '@material-ui/core/Chip'

const warningColor = red["400"];

const usePlanningIdStyles = makeStyles(
  theme => {
    return {
      stages: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: 0,
        "& > *": {
          borderRight: `1px solid ${theme.palette.grey["300"]}`,
          flex: "1 1 25%",
          minWidth: "15ch",
          padding: theme.spacing(1),
          "&:last-child": {
            borderRight: "none"
          }
        }
      },
      stageLabel: {}
    };
  },
  { name: "PlanningIdea" }
);

function PlanningIdeas(props) {
  const {
    investibles,
    marketId,
    acceptedStageId,
    inDialogStageId,
    inReviewStageId,
    inBlockingStageId,
    presenceId,
    activeMarket,
    comments
  } = props;
  const intl = useIntl();
  const classes = usePlanningIdStyles();
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const marketPresences = getMarketPresences(marketPresencesState, marketId);
  const warnAccepted = checkInProgressWarning(investibles, comments, acceptedStageId, presenceId, marketId);
  return (
    <dl className={classes.stages}>
      <div>
        <Tooltip
          title={intl.formatMessage({ id: 'planningVotingStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id="planningVotingStageLabel" />
          </dt>
        </Tooltip>
        <VotingStage
          className={classes.stage}
          id={inDialogStageId}
          investibles={investibles}
          marketId={marketId}
          presenceId={presenceId}
          activeMarket={activeMarket}
          marketPresences={marketPresences}
        />
      </div>
      <div>
        <Tooltip
          title={intl.formatMessage({ id: 'planningAcceptedStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id="planningAcceptedStageLabel" />
          </dt>
        </Tooltip>
        <AcceptedStage
          className={classes.stage}
          id={acceptedStageId}
          investibles={investibles}
          marketId={marketId}
          warnAccepted={warnAccepted}
        />
      </div>
      <div>
        <Tooltip
          title={intl.formatMessage({ id: 'planningReviewStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id="planningReviewStageLabel" />
          </dt>
        </Tooltip>
        <ReviewStage
          className={classes.stage}
          id={inReviewStageId}
          investibles={investibles}
          marketId={marketId}
          comments={comments}
        />
      </div>
      <div>
        <Tooltip
          title={intl.formatMessage({ id: 'planningBlockedStageDescription' })}
        >
          <dt className={classes.stageLabel}>
            <FormattedMessage id="planningBlockedStageLabel" />
          </dt>
        </Tooltip>
        <BlockingStage
          className={classes.stage}
          id={inBlockingStageId}
          investibles={investibles}
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
  acceptedStageId: PropTypes.string.isRequired,
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
      root: {
        border: `1px solid ${theme.palette.grey["400"]}`,
        borderRadius: theme.spacing(1),
        fontSize: ".8em",
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1, 2)
      },
      rootWarnAccepted: {
        border: `1px solid ${theme.palette.grey["400"]}`,
        borderRadius: theme.spacing(1),
        fontSize: ".8em",
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1, 2),
        backgroundColor: yellow["400"],
      },
      fallback: {
        backgroundColor: theme.palette.grey["400"]
      },
      list: {
        listStyle: "none",
        margin: 0,
        padding: 0
      }
    };
  },
  { name: "Stage" }
);

function Stage(props) {
  const {
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
  } = props;

  const stageInvestibles = investibles.filter(investible => {
    const { market_infos: marketInfos } = investible;
    // console.log(`Investible id is ${id}`);
    const marketInfo = marketInfos.find(info => info.market_id === marketId);
    if (process.env.NODE_ENV !== "production") {
      if (marketInfo === undefined) {
        console.warn(`no marketinfo for ${marketId} with `, marketInfos);
      }
    }
    return marketInfo !== undefined && marketInfo.stage === id;
  });

  const classes = useStageClasses(props);

  if (fallbackWarning !== undefined && stageInvestibles.length === 0) {
    return (
      <dd className={clsx(classes.root, classes.fallback)}>
        {fallbackWarning}
      </dd>
    );
  }

  return (
    <dd className={warnAccepted ? classes.rootWarnAccepted : classes.root}>
      <ul className={classes.list}>
        {stageInvestibles.map(inv => {
          const { investible, market_infos: marketInfos } = inv;
          const marketInfo = marketInfos.find(
            info => info.market_id === marketId
          );

          return (
            <li key={investible.id}>
              <StageInvestible
                comments={comments}
                investible={investible}
                marketId={marketId}
                marketInfo={marketInfo}
                updatedText={updatedText}
                showWarning={isReview ? checkReviewWarning(investible, comments) :
                  isVoting ? checkVotingWarning(investible.id, marketPresences) : false}
                showCompletion={showCompletion}
              />
            </li>
          );
        })}
      </ul>
    </dd>
  );
}

Stage.propTypes = {
  id: PropTypes.string.isRequired,
  investibles: PropTypes.array.isRequired,
  marketId: PropTypes.string.isRequired
};

const useVotingStageClasses = makeStyles(
  theme => {
    return {
      root: {},
      fallback: {
        backgroundColor: warningColor,
        color: "white"
      }
    };
  },
  { name: "VotingStage" }
);

function VotingStage(props) {
  const { className, marketId, presenceId, activeMarket, marketPresences, ...other } = props;

  const classes = useVotingStageClasses();
  const intl = useIntl();

  const history = useHistory();
  const link = formMarketAddInvestibleLink(marketId);
  const assignedLink = link + `#assignee=${presenceId}`;
  function onClick(event) {
    // prevent browser navigation
    event.preventDefault();
    navigate(history, assignedLink);
  }

  return (
    <Stage
      classes={classes}
      fallbackWarning={
        activeMarket ?
        <React.Fragment>
          <FormattedMessage id="planningNoneInDialogWarning" />
          <StageLink href={assignedLink} onClick={onClick}>
            {intl.formatMessage({
              id: "createAssignment"
            })}
          </StageLink>
        </React.Fragment> : <React.Fragment>
            <FormattedMessage id="planningNoneInDialogWarning" />
          </React.Fragment>
      }
      marketId={marketId}
      isVoting
      marketPresences={marketPresences}
      updatedText={intl.formatMessage({
        id: "inDialogInvestiblesUpdatedAt"
      })}
      {...other}
   />
  );
}

function AcceptedStage(props) {
  const intl = useIntl();

  return (
    <Stage
      fallbackWarning={<FormattedMessage id="planningNoneAcceptedWarning" />}
      updatedText={intl.formatMessage({
        id: "acceptedInvestiblesUpdatedAt"
      })}
      showCompletion
      {...props}
    />
  );
}

function ReviewStage(props) {
  const intl = useIntl();

  return (
    <Stage
      fallbackWarning={intl.formatMessage({
        id: "planningNoneInReviewWarning"
      })}
      updatedText={intl.formatMessage({
        id: "reviewingInvestiblesUpdatedAt"
      })}
      isReview
      {...props}
    />
  );
}

const useBlockingStageStyles = makeStyles(theme => {
  return {
    root: {
      backgroundColor: warningColor
    },
    fallback: {
      backgroundColor: theme.palette.grey["400"]
    }
  };
});

const generalStageStyles = makeStyles(() => {
  return {
    chipClass: {
      fontSize: 10,
    },
    chipsClass: {
      display: "flex",
    }
  }
});

function BlockingStage(props) {
  const intl = useIntl();
  const classes = useBlockingStageStyles();

  return (
    <Stage
      classes={classes}
      fallbackWarning={intl.formatMessage({
        id: "planningNoneInBlockingWarning"
      })}
      updatedText={intl.formatMessage({
        id: "blockedInvestiblesUpdatedAt"
      })}
      {...props}
    />
  );
}

function StageInvestible(props) {
  const { investible, marketId, marketInfo, updatedText, showWarning, showCompletion } = props;
  const { days_estimate: daysEstimate } = marketInfo;
  const { id, name, created_at: createdAt, label_list: labelList } = investible;
  const history = useHistory();
  const to = formInvestibleLink(marketId, id);
  const safeChangeDate = Date.parse(marketInfo.last_stage_change_date);
  const classes = generalStageStyles();
  return (
    <StageLink
      href={to}
      onClick={event => {
        event.preventDefault();
        navigate(history, to);
      }}
    >
      <Typography color={showWarning ? 'error' : 'initial'} variant="subtitle2">{name}</Typography>
      <Typography variant="inherit">
        {updatedText}
        <FormattedDate value={safeChangeDate} />
      </Typography>
      {showCompletion && daysEstimate && (
        <DaysEstimate readOnly value={daysEstimate} createdAt={createdAt} />
      )}
      <div className={classes.chipsClass}>
        {labelList && labelList.map((label) =>
          <div key={label}>
            <Chip size="small" label={label} className={classes.chipClass} color="primary" />
          </div>
        )}
      </div>
    </StageLink>
  );
}

const useStageLinkStyles = makeStyles(theme => {
  return {
    root: {
      color: "inherit",
      display: "block",
      height: "100%",
      width: "100%"
    }
  };
});

function StageLink(props) {
  const { className, ...other } = props;
  const classes = useStageLinkStyles();
  return <Link className={clsx(classes.root, className)} {...other} />;
}

export default PlanningIdeas;
