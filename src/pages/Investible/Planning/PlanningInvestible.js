import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Card, CardContent, Divider, Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core'
import InsertLinkIcon from '@material-ui/icons/InsertLink'
import { useHistory } from 'react-router'
import { FormattedMessage, useIntl } from 'react-intl'
import YourVoting from '../Voting/YourVoting'
import Voting from '../Decision/Voting'
import CommentBox from '../../../containers/CommentBox/CommentBox'
import { ISSUE_TYPE, JUSTIFY_TYPE, QUESTION_TYPE, SUGGEST_CHANGE_TYPE } from '../../../constants/comments'
import {
  formInvestibleEditLink,
  formMarketAddInvestibleLink,
  formMarketArchivesLink,
  formMarketLink,
  makeArchiveBreadCrumbs,
  makeBreadCrumbs,
  navigate
} from '../../../utils/marketIdPathFunctions'
import Screen from '../../../containers/Screen/Screen'
import CommentAddBox from '../../../containers/CommentBox/CommentAddBox'
import MoveToNextVisibleStageActionButton from './MoveToNextVisibleStageActionButton'
import { getMarketInfo } from '../../../utils/userFunctions'
import {
  getAcceptedStage,
  getBlockedStage,
  getFurtherWorkStage,
  getInCurrentVotingStage,
  getInReviewStage,
  getNotDoingStage,
  getProposedOptionsStage,
  getVerifiedStage
} from '../../../contexts/MarketStagesContext/marketStagesContextHelper'
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext'
import MoveToVerifiedActionButton from './MoveToVerifiedActionButton'
import MoveToVotingActionButton from './MoveToVotingActionButton'
import MoveToNotDoingActionButton from './MoveToNotDoingActionButton'
import MoveToAcceptedActionButton from './MoveToAcceptedActionButton'
import MoveToInReviewActionButton from './MoveToInReviewActionButton'
import ExpiresDisplay from '../../../components/Expiration/ExpiresDisplay'
import { convertDates } from '../../../contexts/ContextUtils'
import DescriptionOrDiff from '../../../components/Descriptions/DescriptionOrDiff'
import EditMarketButton from '../../Dialog/EditMarketButton'
import ExpandableSidebarAction from '../../../components/SidebarActions/ExpandableSidebarAction'
import MarketLinks from '../../Dialog/MarketLinks'
import CardType, {
  IN_BLOCKED,
  IN_PROGRESS,
  IN_REVIEW,
  IN_VERIFIED,
  IN_VOTING,
  NOT_DOING,
  STORY_TYPE
} from '../../../components/CardType'
import clsx from 'clsx'
import { ACTIVE_STAGE, DECISION_TYPE } from '../../../constants/markets'
import DismissableText from '../../../components/Notifications/DismissableText'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import SubSection from '../../../containers/SubSection/SubSection'
import { SECTION_TYPE_SECONDARY } from '../../../constants/global'
import CurrentVoting from '../../Dialog/Decision/CurrentVoting'
import ProposedIdeas from '../../Dialog/Decision/ProposedIdeas'
import { getMarketInvestibles } from '../../../contexts/InvestibesContext/investiblesContextHelper'
import { InvestiblesContext } from '../../../contexts/InvestibesContext/InvestiblesContext'
import { getMarketPresences } from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext'
import { getMarketComments } from '../../../contexts/CommentsContext/commentsContextHelper'
import { CommentsContext } from '../../../contexts/CommentsContext/CommentsContext'
import AddIcon from '@material-ui/icons/Add'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MoveToFurtherWorkActionButton from './MoveToFurtherWorkActionButton'

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: "3px 89px 21px 21px",
      marginTop: "-6px",
      boxShadow: "none",
      [theme.breakpoints.down("sm")]: {
        padding: "3px 21px 42px 21px"
      }
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: "42px",
      paddingBottom: "9px",
      [theme.breakpoints.down("xs")]: {
        fontSize: 25
      }
    },
    content: {
      fontSize: "15 !important",
      lineHeight: "175%",
      color: "#414141",
      [theme.breakpoints.down("xs")]: {
        fontSize: 13
      },
      "& > .ql-container": {
        fontSize: "15 !important"
      }
    },
    cardType: {
      display: "inline-flex"
    },
    votingCardContent: {
      margin: theme.spacing(2, 6),
      padding: 0
    },
    maxBudget: {
      alignItems: "flex-end",
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(2),
      textTransform: "capitalize"
    },
    maxBudgetLabel: {
      color: "#757575",
      fontSize: 14
    },
    maxBudgetValue: {
      fontSize: 16,
      fontWeight: "bold"
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
    toggleEdit,
    isAdmin,
    inArchives,
    hidden
  } = props;
  const classes = useStyles();
  const { name: marketName, id: marketId, market_stage: marketStage, votes_required: votesRequired } = market;
  const activeMarket = marketStage === ACTIVE_STAGE;
  const investmentReasonsRemoved = investibleComments.filter(
    comment => comment.comment_type !== JUSTIFY_TYPE
  );
  const investmentReasons = investibleComments.filter(
    comment => comment.comment_type === JUSTIFY_TYPE
  );
  const marketInfo = getMarketInfo(marketInvestible, marketId);
  const { stage, assigned, children, days_estimate: daysEstimate, inline_market_id: inlineMarketId } = marketInfo;
  const { investible } = marketInvestible;
  const { description, name, locked_by: lockedBy } = investible;
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
  const [marketStagesState] = useContext(MarketStagesContext);
  const inReviewStage = getInReviewStage(marketStagesState, marketId);
  const isInReview = inReviewStage && stage === inReviewStage.id;
  const inAcceptedStage = getAcceptedStage(marketStagesState, marketId);
  const isInAccepted = inAcceptedStage && stage === inAcceptedStage.id;
  const inBlockedStage = getBlockedStage(marketStagesState, marketId);
  const isInBlocked = inBlockedStage && stage === inBlockedStage.id;
  const inVerifiedStage = getVerifiedStage(marketStagesState, marketId);
  const isInVerified = inVerifiedStage && stage === inVerifiedStage.id;
  const furtherWorkStage = getFurtherWorkStage(marketStagesState, marketId)
  const isReadyFurtherWork = furtherWorkStage && stage === furtherWorkStage.id;
  const inCurrentVotingStage = getInCurrentVotingStage(
    marketStagesState,
    marketId
  );
  const isInVoting = inCurrentVotingStage && stage === inCurrentVotingStage.id;
  const notDoingStage = getNotDoingStage(marketStagesState, marketId);
  const isInNotDoing = notDoingStage && stage === notDoingStage.id;
  const inMarketArchives = isInNotDoing || isInVerified;
  const isAssigned = assigned && assigned.includes(userId);
  const breadCrumbTemplates = [
    { name: marketName, link: formMarketLink(marketId) }
  ];
  if (inMarketArchives) {
    breadCrumbTemplates.push({
      name: intl.formatMessage({ id: "dialogArchivesLabel" }),
      link: formMarketArchivesLink(marketId)
    });
  }
  const breadCrumbs = inArchives
    ? makeArchiveBreadCrumbs(history, breadCrumbTemplates)
    : makeBreadCrumbs(history, breadCrumbTemplates);

  const allowedCommentTypes = [QUESTION_TYPE];
  if (!isAssigned) {
    allowedCommentTypes.push(SUGGEST_CHANGE_TYPE);
  }
  if (!isInNotDoing) {
    allowedCommentTypes.unshift(ISSUE_TYPE);
  }
  const stageName = isInVoting
    ? intl.formatMessage({ id: "planningVotingStageLabel" })
    : // eslint-disable-next-line no-nested-ternary
    isInReview
    ? intl.formatMessage({ id: "planningReviewStageLabel" })
    : // eslint-disable-next-line no-nested-ternary
    isInAccepted
    ? intl.formatMessage({ id: "planningAcceptedStageLabel" })
    : // eslint-disable-next-line no-nested-ternary
    isInBlocked
    ? intl.formatMessage({ id: "planningBlockedStageLabel" })
    : isInVerified
    ? intl.formatMessage({ id: "planningVerifiedStageLabel" })
    : intl.formatMessage({ id: "planningNotDoingStageLabel" });
  const [investiblesState] = useContext(InvestiblesContext);
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const [commentsState] = useContext(CommentsContext);
  const [changeStagesExpanded, setChangeStagesExpanded] = useState(false);
  if (!investibleId) {
    // we have no usable data;
    return <></>;
  }
  const invested = marketPresences.filter(presence => {
    const { investments } = presence;
    if (!Array.isArray(investments) || investments.length === 0) {
      return false;
    }
    let found = false;
    investments.forEach(investment => {
      const { investible_id: invId } = investment;
      if (invId === investibleId) {
        found = true;
      }
    });
    return found;
  });

  function assignedInStage(investibles, userId, stageId) {
    return investibles.filter(investible => {
      const { market_infos: marketInfos } = investible;
      // // console.log(`Investible id is ${id}`);
      const marketInfo = marketInfos.find(info => info.market_id === marketId);
      // eslint-disable-next-line max-len
      return (
        marketInfo.stage === stageId &&
        marketInfo.assigned &&
        marketInfo.assigned.includes(userId)
      );
    });
  }

  function hasEnoughVotes (myInvested, myRequired) {
    const required = myRequired !== undefined ? myRequired : 1;
    return _.size(myInvested) >= required;
  }
  const enoughVotes = hasEnoughVotes(invested, votesRequired);

  function getSidebarActions() {
    if (!activeMarket) {
      return [];
    }
    const sidebarActions = [];
    if (isInVoting || isInAccepted) {
      if (!inlineMarketId && isAssigned ) {
        sidebarActions.push(
          <ExpandableSidebarAction
            id="newOption"
            key="newOption"
            label={intl.formatMessage({ id: 'inlineAddExplanation' })}
            onClick={() => navigate(history, `${formMarketAddInvestibleLink(marketId)}#parentInvestibleId=${investibleId}`)}
            icon={<AddIcon/>}
            openLabel={intl.formatMessage({ id: 'inlineAddLabel' })}
          />
        );
      }
      else if (inlineMarketId) {
        sidebarActions.push(
          <ExpandableSidebarAction
            id="newOption"
            key="newOption"
            label={intl.formatMessage({ id: 'inlineAddExplanation' })}
            onClick={() => navigate(history, formMarketAddInvestibleLink(inlineMarketId))}
            icon={<AddIcon/>}
            openLabel={intl.formatMessage({ id: 'inlineAddLabel' })}
          />
        );
      }
    }
    if (!isInNotDoing) {
      if (isAssigned) {
        sidebarActions.push(<ExpandableSidebarAction
          id="link"
          key="link"
          icon={<InsertLinkIcon/>}
          label={intl.formatMessage({ id: "childDialogExplanation" })}
          openLabel={intl.formatMessage({ id: 'planningInvestibleDecision' })}
          onClick={() => navigate(history, `/dialogAdd#type=${DECISION_TYPE}&investibleId=${investibleId}&id=${marketId}`)}
        />)
      }
    }
    return sidebarActions;
  }

  function getStageActions() {
    if (!activeMarket) {
      return [];
    }
    const stageActions = [];
    // you can only move stages besides not doing or verfied if you're assigned to it
    if (isAssigned) {
      if (isInVoting || isInAccepted) {
        const nextStageId = isInVoting ? inAcceptedStage.id : inReviewStage.id;
        const assignedInNextStage = assignedInStage(
          investibles,
          userId,
          nextStageId
        );
        if (isInAccepted || (enoughVotes && _.isEmpty(assignedInNextStage))) {
          stageActions.push(
            <MoveToNextVisibleStageActionButton
              key="visible"
              investibleId={investibleId}
              marketId={marketId}
              currentStageId={stage}
              isOpen={changeStagesExpanded}
            />
          );
        }
      }
      if (isInAccepted && _.isEmpty(assignedInStage(investibles, userId, inCurrentVotingStage.id))) {
        stageActions.push(
          <MoveToVotingActionButton
            investibleId={investibleId}
            marketId={marketId}
            currentStageId={stage}
            isOpen={changeStagesExpanded}
            key="voting"
          />
        );
      }
      if (isInReview && _.isEmpty(assignedInStage(investibles, userId, inAcceptedStage.id))) {
        stageActions.push(
          <MoveToAcceptedActionButton
            investibleId={investibleId}
            marketId={marketId}
            currentStageId={stage}
            isOpen={changeStagesExpanded}
            key="acceptedFromReview"
          />
        );
      }
      if (isInBlocked) {
        // eslint-disable-next-line max-len
        const blockingComments = investibleComments.filter(
          comment => comment.comment_type === ISSUE_TYPE && !comment.resolved
        );
        if (_.isEmpty(blockingComments)) {
          // eslint-disable-next-line max-len
          const assignedInVotingStage = assignedInStage(
            investibles,
            userId,
            inCurrentVotingStage.id
          );
          if (_.isEmpty(assignedInVotingStage)) {
            stageActions.push(
              <MoveToVotingActionButton
                investibleId={investibleId}
                marketId={marketId}
                currentStageId={stage}
                isOpen={changeStagesExpanded}
                key="voting"
              />
            );
          }
          if (enoughVotes) {
            // eslint-disable-next-line max-len
            const assignedInAcceptedStage = assignedInStage(
              investibles,
              userId,
              inAcceptedStage.id
            );
            if (_.isEmpty(assignedInAcceptedStage)) {
              stageActions.push(
                <MoveToAcceptedActionButton
                  investibleId={investibleId}
                  marketId={marketId}
                  currentStageId={stage}
                  isOpen={changeStagesExpanded}
                  key="accepted"
                />
              );
            }
            stageActions.push(
              <MoveToInReviewActionButton
                investibleId={investibleId}
                marketId={marketId}
                currentStageId={stage}
                isOpen={changeStagesExpanded}
                key="inreview"
              />
            );
          }
        }
      }
    }
    if (!isReadyFurtherWork && isAssigned && !isInVoting) {
      stageActions.push(
        <MoveToFurtherWorkActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          key="furtherwork"
        />
      );
    }
    if (!isInVerified) {
      stageActions.push(
        <MoveToVerifiedActionButton
          investibleId={investibleId}
          marketId={marketId}
          currentStageId={stage}
          isOpen={changeStagesExpanded}
          key="verified"
        />
      );
    }
    if (!isInNotDoing) {
      stageActions.push(<MoveToNotDoingActionButton
        investibleId={investibleId}
        marketId={marketId}
        currentStageId={stage}
        isOpen={changeStagesExpanded}
        key="notdoing"
      />);
    }
    return stageActions;
  }

  const inlineInvestibles = getMarketInvestibles(investiblesState, inlineMarketId) || [];
  function getInlineInvestiblesForStage(stage) {
    if (stage) {
      return inlineInvestibles.reduce((acc, inv) => {
        const { market_infos: marketInfos } = inv;
        for (let x = 0; x < marketInfos.length; x += 1) {
          if (marketInfos[x].stage === stage.id) {
            return [...acc, inv];
          }
        }
        return acc;
      }, []);
    }
    return [];
  }
  const canVote = !isAssigned && isInVoting;
  const inlineMarketPresences = getMarketPresences(marketPresencesState, inlineMarketId);
  const underConsiderationStage = getInCurrentVotingStage(marketStagesState, inlineMarketId);
  const underConsideration = getInlineInvestiblesForStage(underConsiderationStage);
  const proposedStage = getProposedOptionsStage(marketStagesState, inlineMarketId);
  const proposed = getInlineInvestiblesForStage(proposedStage);
  const inlineInvestibleComments = getMarketComments(commentsState, inlineMarketId);
  function toggleAssign() {
    navigate(history, `${formInvestibleEditLink(marketId, investibleId)}#assign=true`);
  }
  const subtype = isInVoting ? IN_VOTING : isInAccepted ? IN_PROGRESS : isInReview ? IN_REVIEW :
    isInBlocked ? IN_BLOCKED : isInNotDoing ? NOT_DOING : IN_VERIFIED;
  function expansionChanged(event, expanded) {
    setChangeStagesExpanded(expanded);
  }
  return (
    <Screen
      title={name}
      tabTitle={name}
      breadCrumbs={breadCrumbs}
      hidden={hidden}
      sidebarActions={getSidebarActions()}
    >
      {activeMarket && isInVoting && isAssigned && enoughVotes && _.isEmpty(assignedInStage(investibles, userId, inAcceptedStage.id)) && (
        <DismissableText textId='planningInvestibleEnoughVotesHelp' />
      )}
      {activeMarket && isInVoting && isAssigned && enoughVotes && !_.isEmpty(assignedInStage(investibles, userId, inAcceptedStage.id)) && (
        <DismissableText textId='planningInvestibleAcceptedFullHelp' />
      )}
      {activeMarket && isInAccepted && isAssigned && (
        <DismissableText textId='planningInvestibleAcceptedHelp' />
      )}
      {activeMarket && canVote && (
        <DismissableText textId='planningInvestibleVotingHelp' />
      )}
      <Card elevation={0}>
        <CardType
          className={classes.cardType}
          label={`${stageName} ${intl.formatMessage({
            id: "planningInvestibleDescription"
          })}`}
          type={STORY_TYPE}
          subtype={subtype}
        />
        {daysEstimate > 0 && (
          <Typography className={classes.maxBudget} component="div">
            <div className={classes.maxBudgetLabel}>
              <FormattedMessage id="daysEstimateLabel" />
            </div>
            <div className={classes.maxBudgetValue}>
              <FormattedMessage
                id="maxBudgetValue"
                values={{ x: daysEstimate }}
              />
            </div>
          </Typography>
        )}
        <CardContent className={classes.votingCardContent}>
          <h1>
            {name}
            {(isAssigned || isInNotDoing || isInVoting) && (
              <EditMarketButton
                labelId="edit"
                marketId={marketId}
                onClick={toggleEdit}
              />
            )}
          </h1>
          {lockedBy && (
            <Typography>
              {intl.formatMessage({ id: "lockedBy" }, { x: lockedByName })}
            </Typography>
          )}
          <DescriptionOrDiff
            id={investibleId}
            description={description}
          />
          <Divider />
          <MarketMetaData
            investibleId={investibleId}
            isInVoting={isInVoting}
            market={market}
            marketInvestible={marketInvestible}
            marketPresences={marketPresences}
            isAdmin={isAdmin}
            toggleAssign={toggleAssign}
            hidden={hidden}
            children={children || []}
            stageActions={getStageActions()}
            expansionChanged={expansionChanged}
          />
        </CardContent>
      </Card>
      {isInVoting && activeMarket && (canVote ? (
            <YourVoting
              investibleId={investibleId}
              marketPresences={marketPresences}
              comments={investmentReasons}
              userId={userId}
              market={market}
              showBudget
            />
          ) : (
            <Typography>{intl.formatMessage({ id: 'planningInvestibleCantVote' })}</Typography>
        ))}
      <h2>
        <FormattedMessage id="decisionInvestibleOthersVoting" />
      </h2>
      <Voting
        investibleId={investibleId}
        marketPresences={marketPresences}
        investmentReasons={investmentReasons}
      />
      {/* unstyled from here on out because no FIGMA */}
      <Grid container spacing={2}>
        {!_.isEmpty(underConsideration) && (
          <Grid item xs={12} style={{ marginTop: '30px' }}>
            <SubSection
              id="currentVoting"
              type={SECTION_TYPE_SECONDARY}
              title={intl.formatMessage({ id: 'storyCurrentVotingLabel' })}
            >
              <CurrentVoting
                marketPresences={inlineMarketPresences}
                investibles={underConsideration}
                marketId={inlineMarketId}
                comments={inlineInvestibleComments}
              />
            </SubSection>
          </Grid>
        )}
        {!_.isEmpty(proposed) && (
          <Grid item xs={12} style={{ marginTop: '56px' }}>
            <SubSection
              type={SECTION_TYPE_SECONDARY}
              title={intl.formatMessage({ id: 'decisionDialogProposedOptionsLabel' })}
            >
              <ProposedIdeas
                investibles={proposed}
                marketId={inlineMarketId}
                comments={inlineInvestibleComments}
              />
            </SubSection>
          </Grid>
        )}
        <Grid item xs={12} style={{ marginTop: '71px' }}>
          {activeMarket && (
            <CommentAddBox
              allowedTypes={allowedCommentTypes}
              investible={investible}
              marketId={marketId}
              issueWarningId="issueWarningPlanning"
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
  // eslint-disable-next-line react/forbid-prop-types
  market: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  marketInvestible: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  marketPresences: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  investibleComments: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  investibles: PropTypes.arrayOf(PropTypes.object),
  investibleId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  toggleEdit: PropTypes.func,
  isAdmin: PropTypes.bool,
  inArchives: PropTypes.bool,
  hidden: PropTypes.bool
};

PlanningInvestible.defaultProps = {
  marketPresences: [],
  investibleComments: [],
  investibles: [],
  toggleEdit: () => {},
  isAdmin: false,
  inArchives: false,
  hidden: false
};

export const useMetaDataStyles = makeStyles(
  theme => {
    return {
      root: {
        alignItems: "flex-start",
        display: "flex"
      },

      group: {
        backgroundColor: theme.palette.grey["300"],
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(0, 1),
        padding: theme.spacing(1, 1),
        "&:first-child": {
          marginLeft: 0
        },
        "& dt": {
          color: "#828282",
          fontSize: 10,
          fontWeight: "bold",
          marginBottom: theme.spacing(0.5)
        },
        "& dd": {
          fontSize: 20,
          margin: 0,
          lineHeight: "26px"
        }
      },
      expiration: {
        "& dd": {
          alignItems: "center",
          display: "flex",
          flex: "1 auto",
          flexDirection: "row",
          fontWeight: "bold"
        }
      },
      expansionControl: {
        backgroundColor: theme.palette.grey["300"],
      },
      fontControl: {
        alignItems: "center",
        fontWeight: "bold",
      },
      expirationProgress: {
        marginRight: theme.spacing(1)
      },
      assignments: {
        "& ul": {
          margin: 0,
          padding: 0
        },
        "& li": {
          display: "inline-flex",
          fontWeight: "bold",
          marginLeft: theme.spacing(1),
          "&:first-child": {
            marginLeft: 0
          }
        }
      }
    };
  },
  { name: "MetaData" }
);

function MarketMetaData(props) {
  const {
    investibleId,
    isInVoting,
    market,
    marketPresences,
    marketInvestible,
    isAdmin,
    toggleAssign,
    children,
    hidden,
    stageActions,
    expansionChanged,
  } = props;

  const classes = useMetaDataStyles();

  const newestVote = React.useMemo(() => {
    let latest;
    marketPresences.forEach(presence => {
      const { investments } = presence;
      investments.forEach(investment => {
        const { updated_at: updatedAt, investible_id: invId } = convertDates(
          investment
        );
        if (investibleId === invId && (!latest || updatedAt > latest)) {
          latest = updatedAt;
        }
      });
    });
    return latest;
  }, [investibleId, marketPresences]);

  return (
    <dl className={classes.root}>
      {newestVote && isInVoting && (
        <div className={clsx(classes.group, classes.expiration)}>
          <dt>
            <FormattedMessage id="investmentExpiration" />
          </dt>
          <dd>
            <ExpiresDisplay
              createdAt={newestVote}
              expirationMinutes={market.investment_expiration * 1440}
            />
          </dd>
        </div>
      )}
      {market.id && marketInvestible.investible && (
        <div className={clsx(classes.group, classes.assignments)}>
          <dt>
            <FormattedMessage id="planningInvestibleAssignments" />
          </dt>
          <dd>
            <Assignments
              marketId={market.id}
              marketPresences={marketPresences}
              investible={marketInvestible}
              isAdmin={isAdmin}
              toggleAssign={toggleAssign}
            />
          </dd>
        </div>
      )}
      <ExpansionPanel className={classes.expansionControl} onChange={expansionChanged}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="stages-content"
          id="stages-header"
        >
          <div className={classes.fontControl}>
            <FormattedMessage id="changeStage" />
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            {stageActions}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <MarketLinks links={children} hidden={hidden} />
    </dl>
  );
}

MarketMetaData.propTypes = {
  investibleId: PropTypes.string.isRequired,
  isInVoting: PropTypes.bool.isRequired,
  market: PropTypes.object.isRequired,
  marketPresences: PropTypes.array.isRequired,
  marketInvestible: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  toggleAssign: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.string).isRequired,
  hidden: PropTypes.bool.isRequired,
  stageActions: PropTypes.object,
  expansionChanged: PropTypes.func.isRequired,
}

function Assignments(props) {
  const { investible, marketId, marketPresences, isAdmin, toggleAssign } = props;
  const intl = useIntl();
  const marketInfo = getMarketInfo(investible, marketId);
  const { assigned = [] } = marketInfo;

  return (
    <>
      <ul>
        {_.isEmpty(assigned) && (
          <Typography key="unassigned" component="li">
            {intl.formatMessage({ id: 'reassignToMove' })}
          </Typography>
        )}
        {assigned.map(userId => {
          let user = marketPresences.find(presence => presence.id === userId);
          if (!user) {
            user = { name: "Removed" };
          }
          return (
            <Typography key={userId} component="li">
              {user.name}
            </Typography>
          );
        })}
      </ul>
      <ul>
        {isAdmin && (
          <Tooltip
            title={intl.formatMessage({ id: 'storyAddParticipantsLabel' })}
          >
            <IconButton
              onClick={toggleAssign}
            >
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        )}
      </ul>
    </>
  );
}

export default PlanningInvestible;
