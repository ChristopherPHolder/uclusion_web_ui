import React, { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Divider,
  CircularProgress
} from "@material-ui/core";
import { useHistory } from "react-router";
import { useIntl, FormattedMessage, FormattedRelativeTime } from "react-intl";
import SubSection from "../../../containers/SubSection/SubSection";
import YourVoting from "../Voting/YourVoting";
import Voting from "../Decision/Voting";
import CommentBox from "../../../containers/CommentBox/CommentBox";
import {
  ISSUE_TYPE,
  JUSTIFY_TYPE,
  QUESTION_TYPE,
  SUGGEST_CHANGE_TYPE
} from "../../../constants/comments";
import {
  formMarketArchivesLink,
  formMarketLink,
  makeArchiveBreadCrumbs,
  makeBreadCrumbs
} from "../../../utils/marketIdPathFunctions";
import Screen from "../../../containers/Screen/Screen";
import RaiseIssue from "../../../components/SidebarActions/RaiseIssue";
import AskQuestions from "../../../components/SidebarActions/AskQuestion";
import SuggestChanges from "../../../components/SidebarActions/SuggestChanges";
import CommentAddBox from "../../../containers/CommentBox/CommentAddBox";
import MoveToNextVisibleStageActionButton from "./MoveToNextVisibleStageActionButton";
import { getMarketInfo } from "../../../utils/userFunctions";
import {
  getAcceptedStage,
  getBlockedStage,
  getInCurrentVotingStage,
  getInReviewStage,
  getNotDoingStage,
  getVerifiedStage
} from "../../../contexts/MarketStagesContext/marketStagesContextHelper";
import { MarketStagesContext } from "../../../contexts/MarketStagesContext/MarketStagesContext";
import MoveToVerifiedActionButton from "./MoveToVerifiedActionButton";
import MoveToVotingActionButton from "./MoveToVotingActionButton";
import MoveToNotDoingActionButton from "./MoveToNotDoingActionButton";
import { scrollToCommentAddBox } from "../../../components/Comments/commentFunctions";
import MoveToAcceptedActionButton from "./MoveToAcceptedActionButton";
import MoveToInReviewActionButton from "./MoveToInReviewActionButton";
import PlanningInvestibleEditActionButton from "./PlanningInvestibleEditActionButton";
import ExpiresDisplay from "../../../components/Expiration/ExpiresDisplay";
import { convertDates } from "../../../contexts/ContextUtils";
import { ACTIVE_STAGE } from "../../../constants/markets";
import {
  SECTION_TYPE_PRIMARY,
  SECTION_TYPE_PRIMARY_WARNING,
  SECTION_TYPE_SECONDARY
} from "../../../constants/global";
import DescriptionOrDiff from "../../../components/Descriptions/DescriptionOrDiff";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import EditMarketButton from "../../Dialog/EditMarketButton";
import CardType, { VOTING_TYPE } from "../../../components/CardType";
import clsx from "clsx";

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
    }
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
  const {
    name: marketName,
    id: marketId,
    investment_expiration: expirationDays,
    market_stage: marketStage
  } = market;
  const activeMarket = marketStage === ACTIVE_STAGE;
  const investmentReasonsRemoved = investibleComments.filter(
    comment => comment.comment_type !== JUSTIFY_TYPE
  );
  const investmentReasons = investibleComments.filter(
    comment => comment.comment_type === JUSTIFY_TYPE
  );
  const [commentAddType, setCommentAddType] = useState(ISSUE_TYPE);
  const [commentAddHidden, setCommentAddHidden] = useState(true);
  const marketInfo = getMarketInfo(marketInvestible, marketId);
  const { stage, assigned } = marketInfo;
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
  const commentAddRef = useRef(null);
  const [marketStagesState] = useContext(MarketStagesContext);
  const inReviewStage = getInReviewStage(marketStagesState, marketId);
  const isInReview = inReviewStage && stage === inReviewStage.id;
  const inAcceptedStage = getAcceptedStage(marketStagesState, marketId);
  const isInAccepted = inAcceptedStage && stage === inAcceptedStage.id;
  const inBlockedStage = getBlockedStage(marketStagesState, marketId);
  const isInBlocked = inBlockedStage && stage === inBlockedStage.id;
  const inVerifiedStage = getVerifiedStage(marketStagesState, marketId);
  const isInVerified = inVerifiedStage && stage === inVerifiedStage.id;
  const inCurrentVotingStage = getInCurrentVotingStage(
    marketStagesState,
    marketId
  );
  const isInVoting = inCurrentVotingStage && stage === inCurrentVotingStage.id;
  const notDoingStage = getNotDoingStage(marketStagesState, marketId);
  const isInNotDoing = notDoingStage && stage === notDoingStage.id;
  const inMarketArchives = isInNotDoing || isInVerified;

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

  const allowedCommentTypes = [ISSUE_TYPE, QUESTION_TYPE, SUGGEST_CHANGE_TYPE];
  // eslint-disable-next-line no-nested-ternary
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

  function getNewestVote() {
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
  }

  function commentButtonOnClick(type) {
    setCommentAddType(type);
    setCommentAddHidden(false);
    scrollToCommentAddBox(commentAddRef);
  }

  function closeCommentAdd() {
    setCommentAddHidden(true);
  }

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
      // console.log(`Investible id is ${id}`);
      const marketInfo = marketInfos.find(info => info.market_id === marketId);
      // eslint-disable-next-line max-len
      return (
        marketInfo.stage === stageId &&
        marketInfo.assigned &&
        marketInfo.assigned.includes(userId)
      );
    });
  }

  function getSidebarActions() {
    if (!activeMarket) {
      return [];
    }
    const sidebarActions = [];

    if (isAdmin && isInNotDoing) {
      sidebarActions.push(
        <PlanningInvestibleEditActionButton
          marketId={marketId}
          key="edit"
          isInNotDoing={isInNotDoing}
          onClick={toggleEdit}
        />
      );
    }
    // you can only move stages besides not doing or verfied if you're assigned to it
    if (assigned && assigned.includes(userId)) {
      if (isInVoting || isInAccepted) {
        const nextStageId = isInVoting ? inAcceptedStage.id : inReviewStage.id;
        const assignedInNextStage = assignedInStage(
          investibles,
          userId,
          nextStageId
        );
        if (
          !_.isEmpty(invested) &&
          (_.isEmpty(assignedInNextStage) || isInAccepted)
        ) {
          sidebarActions.push(
            <MoveToNextVisibleStageActionButton
              key="visible"
              investibleId={investibleId}
              marketId={marketId}
              stageId={stage}
            />
          );
        }
      }
      if (
        isInAccepted &&
        _.isEmpty(assignedInStage(investibles, userId, inCurrentVotingStage.id))
      ) {
        sidebarActions.push(
          <MoveToVotingActionButton
            investibleId={investibleId}
            marketId={marketId}
            stageId={stage}
            key="voting"
          />
        );
      }
      if (
        isInReview &&
        _.isEmpty(assignedInStage(investibles, userId, inAcceptedStage.id))
      ) {
        sidebarActions.push(
          <MoveToAcceptedActionButton
            investibleId={investibleId}
            marketId={marketId}
            stageId={stage}
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
            sidebarActions.push(
              <MoveToVotingActionButton
                investibleId={investibleId}
                marketId={marketId}
                stageId={stage}
                key="voting"
              />
            );
          }
          if (!_.isEmpty(invested)) {
            // eslint-disable-next-line max-len
            const assignedInAcceptedStage = assignedInStage(
              investibles,
              userId,
              inAcceptedStage.id
            );
            if (_.isEmpty(assignedInAcceptedStage)) {
              sidebarActions.push(
                <MoveToAcceptedActionButton
                  investibleId={investibleId}
                  marketId={marketId}
                  stageId={stage}
                  key="accepted"
                />
              );
            }
            sidebarActions.push(
              <MoveToInReviewActionButton
                investibleId={investibleId}
                marketId={marketId}
                stageId={stage}
                key="inreview"
              />
            );
          }
        }
      }
    }
    if (!isInVerified) {
      sidebarActions.push(
        <MoveToVerifiedActionButton
          investibleId={investibleId}
          marketId={marketId}
          stageId={stage}
          key="verified"
        />
      );
    }
    if (!isInNotDoing) {
      sidebarActions.push(
        <MoveToNotDoingActionButton
          investibleId={investibleId}
          marketId={marketId}
          stageId={stage}
          key="notdoing"
        />
      );
    }
    sidebarActions.push(
      <RaiseIssue key="issue" onClick={commentButtonOnClick} />
    );
    sidebarActions.push(
      <AskQuestions key="question" onClick={commentButtonOnClick} />
    );
    sidebarActions.push(
      <SuggestChanges key="suggest" onClick={commentButtonOnClick} />
    );
    return sidebarActions;
  }

  const discussionVisible =
    !commentAddHidden || !_.isEmpty(investmentReasonsRemoved);
  const newestVote = getNewestVote();

  const canEdit = isAdmin && (isInNotDoing || assigned.includes(userId));

  const votes = []; // TODO
  return (
    <Screen>
      <Card elevation={0}>
        <CardType className={classes.cardType} type={VOTING_TYPE} />
        <CardContent className={classes.votingCardContent}>
          <h1>Vote Page UI TODO</h1>
          <DescriptionOrDiff
            hidden={hidden}
            id={investibleId}
            description={description}
          />
          <Divider />
          <MarketMetaData
            marketId={marketId}
            marketInvestible={marketInvestible}
            marketPresences={marketPresences}
          />
        </CardContent>
      </Card>
      <h2>Add a vote</h2>
      <YourVoting
        investibleId={investibleId}
        marketPresences={marketPresences}
        comments={investmentReasons}
        userId={userId}
        market={market}
        showBudget
      />
      <h2>
        Current Votes <button> uncertain-to-certain</button>
      </h2>
      <ol>
        {votes.map(vote => {
          return (
            <li>
              <Vote key={vote.id} vote={vote} />
            </li>
          );
        })}
      </ol>
    </Screen>
  );

  return (
    <Screen
      title={name}
      tabTitle={name}
      breadCrumbs={breadCrumbs}
      hidden={hidden}
      sidebarActions={getSidebarActions()}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubSection
            type={
              isInBlocked ? SECTION_TYPE_PRIMARY_WARNING : SECTION_TYPE_PRIMARY
            }
            title={`${stageName} - ${intl.formatMessage({
              id: "decisionInvestibleDescription"
            })}`}
          >
            <Paper className={classes.container}>
              <Typography className={classes.title} variant="h3" component="h1">
                {name}
              </Typography>
              <DescriptionOrDiff
                hidden={hidden}
                id={investibleId}
                description={description}
              />
              {isAdmin && !isInNotDoing && (
                <EditMarketButton
                  key="edit"
                  labelId={intl.formatMessage({ id: "edit" })}
                  marketId={marketId}
                  onClick={toggleEdit}
                />
              )}
            </Paper>
            {lockedBy && (
              <Typography>
                {intl.formatMessage({ id: "lockedBy" }, { x: lockedByName })}
              </Typography>
            )}
            {newestVote && isInVoting && (
              <List>
                <ListItem>
                  <ExpiresDisplay
                    createdAt={newestVote}
                    expirationMinutes={expirationDays * 1440}
                  />
                  <Typography>
                    {intl.formatMessage({ id: "investmentExpiration" })}
                  </Typography>
                </ListItem>
              </List>
            )}
          </SubSection>
        </Grid>
        {(!assigned || !assigned.includes(userId)) && isInVoting && (
          <Grid item xs={12}>
            <SubSection
              type={SECTION_TYPE_SECONDARY}
              title={intl.formatMessage({ id: "decisionInvestibleYourVoting" })}
            >
              <YourVoting
                investibleId={investibleId}
                marketPresences={marketPresences}
                comments={investmentReasons}
                userId={userId}
                market={market}
                showBudget
              />
            </SubSection>
          </Grid>
        )}
        <Grid item xs={12}>
          <SubSection
            type={SECTION_TYPE_SECONDARY}
            title={intl.formatMessage({ id: "decisionInvestibleYourVoting" })}
          >
            <YourVoting
              investibleId={investibleId}
              marketPresences={marketPresences}
              comments={investmentReasons}
              userId={userId}
              market={market}
              showBudget
            />
          </SubSection>
        </Grid>
        )}
        <Grid item xs={12}>
          <SubSection
            type={SECTION_TYPE_SECONDARY}
            title={intl.formatMessage({ id: "decisionInvestibleOthersVoting" })}
          >
            <Voting
              investibleId={investibleId}
              marketPresences={marketPresences}
              investmentReasons={investmentReasons}
            />
          </SubSection>
        </Grid>
        {discussionVisible && (
          <Grid item xs={12}>
            <SubSection
              type={SECTION_TYPE_SECONDARY}
              title={intl.formatMessage({ id: "decisionInvestibleDiscussion" })}
            >
              <CommentAddBox
                hidden={commentAddHidden}
                allowedTypes={allowedCommentTypes}
                investible={investible}
                marketId={marketId}
                issueWarningId="issueWarningPlanning"
                type={commentAddType}
                onSave={closeCommentAdd}
                onCancel={closeCommentAdd}
              />
              <div ref={commentAddRef} />
              <CommentBox
                comments={investmentReasonsRemoved}
                marketId={marketId}
              />
            </SubSection>
          </Grid>
        )}
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

const useMetaDataStyles = makeStyles(
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
        padding: theme.spacing(1, 2),
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
  const { marketId, marketPresences, marketInvestible } = props;

  const classes = useMetaDataStyles();

  return (
    <dl className={classes.root}>
      <div className={clsx(classes.group, classes.expiration)}>
        <dt>
          <FormattedMessage id="decisionInvestibleVotingExpirationLabel" />
        </dt>
        <dd>
          <CircularProgress
            className={classes.expirationProgress}
            size={22}
            thickness={8}
            variant="static"
            value={33}
          />
          <FormattedRelativeTime unit="day" value={13} />
        </dd>
      </div>
      {marketId && marketInvestible.investible && (
        <div className={clsx(classes.group, classes.assignments)}>
          <dt>
            <FormattedMessage id="planningInvestibleAssignments" />
          </dt>
          <dd>
            <Assignments
              marketId={marketId}
              marketPresences={marketPresences}
              investible={marketInvestible}
            />
          </dd>
        </div>
      )}
    </dl>
  );
}

function Assignments(props) {
  const { investible, marketId, marketPresences } = props;

  const marketInfo = getMarketInfo(investible, marketId);
  const { assigned = [] } = marketInfo;

  return (
    <ul>
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
  );
}

function Vote() {
  return null;
}

export default PlanningInvestible;
