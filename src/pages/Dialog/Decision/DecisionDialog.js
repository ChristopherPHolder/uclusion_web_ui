/**
 * A component that renders a _decision_ dialog
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { Card, CardContent, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import _ from 'lodash'
import AddIcon from '@material-ui/icons/Add'
import {
  formMarketAddInvestibleLink,
  makeArchiveBreadCrumbs,
  makeBreadCrumbs,
  navigate,
} from '../../../utils/marketIdPathFunctions'
import ProposedIdeas from './ProposedIdeas'
import SubSection from '../../../containers/SubSection/SubSection'
import CurrentVoting from './CurrentVoting'
import CommentBox from '../../../containers/CommentBox/CommentBox'
import CommentAddBox from '../../../containers/CommentBox/CommentAddBox'
import Screen from '../../../containers/Screen/Screen'
import { ISSUE_TYPE, QUESTION_TYPE } from '../../../constants/comments'
import { SECTION_TYPE_SECONDARY } from '../../../constants/global'
import { ACTIVE_STAGE, DECISION_TYPE } from '../../../constants/markets'
import UclusionTour from '../../../components/Tours/UclusionTour'
import {
  PURE_SIGNUP_ADD_DIALOG_OPTIONS,
  PURE_SIGNUP_ADD_DIALOG_OPTIONS_STEPS,
  PURE_SIGNUP_FAMILY_NAME
} from '../../../components/Tours/pureSignupTours'
import CardType from '../../../components/CardType'
import DescriptionOrDiff from '../../../components/Descriptions/DescriptionOrDiff'
import clsx from 'clsx'
import ExpiresDisplay from '../../../components/Expiration/ExpiresDisplay'
import ExpiredDisplay from '../../../components/Expiration/ExpiredDisplay'
import { useMetaDataStyles } from '../../Investible/Planning/PlanningInvestible'
import Collaborators from '../Collaborators'
import DialogActions from '../../Home/DialogActions'
import ParentSummary from '../ParentSummary'
import CardActions from '@material-ui/core/CardActions'
import ExpandableAction from '../../../components/SidebarActions/Planning/ExpandableAction'

const useStyles = makeStyles(
  theme => ({
    root: {
      alignItems: "flex-start",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between"
    },
    cardType: {
      display: "inline-flex"
    },
    actions: {},
    content: {
      flexBasis: "100%",
      padding: theme.spacing(0, 4)
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
  } = props;
  const classes = useStyles();
  const metaClasses = useMetaDataStyles();
  const intl = useIntl();
  const {
    is_admin: isAdmin,
  } = myPresence;
  const underConsiderationStage = marketStages.find((stage) => stage.allows_investment);
  const proposedStage = marketStages.find((stage) => !stage.allows_investment);
  const history = useHistory();
  const investibleComments = comments.filter((comment) => comment.investible_id);
  const marketComments = comments.filter((comment) => !comment.investible_id);
  const allowedCommentTypes = [ISSUE_TYPE, QUESTION_TYPE];
  const {
    id: marketId,
    name: marketName,
    description,
    market_stage: marketStage,
    market_type: marketType,
    created_at: createdAt,
    updated_at: updatedAt,
    expiration_minutes: expirationMinutes,
    created_by: createdBy,
    parent_market_id: parentMarketId,
    parent_investible_id: parentInvestibleId,
    is_inline: isInline,
  } = market;
  const activeMarket = marketStage === ACTIVE_STAGE;
  const inArchives = !activeMarket || (myPresence && !myPresence.following);
  const breadCrumbs = inArchives ? makeArchiveBreadCrumbs(history) : makeBreadCrumbs(history);
  const participantTourSteps = [
  ];
  const tourSteps = isAdmin? PURE_SIGNUP_ADD_DIALOG_OPTIONS_STEPS : participantTourSteps;
  const tourName = isAdmin? PURE_SIGNUP_ADD_DIALOG_OPTIONS : '';
  const tourFamily = isAdmin? PURE_SIGNUP_FAMILY_NAME: '';
  const addLabel = isAdmin ? 'decisionDialogAddInvestibleLabel' : 'decisionDialogProposeInvestibleLabel';
  const addLabelExplanation = isAdmin ? 'decisionDialogAddExplanationLabel' : 'decisionDialogProposeExplanationLabel';
  function getInvestiblesForStage(stage) {
    if (stage) {
      return investibles.reduce((acc, inv) => {
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
  const underConsideration = getInvestiblesForStage(underConsiderationStage);
  const proposed = getInvestiblesForStage(proposedStage);
  return (
    <Screen
      title={marketName}
      tabTitle={marketName}
      hidden={hidden}
      breadCrumbs={breadCrumbs}
      sidebarActions={[]}
    >
      <UclusionTour
        hidden={hidden}
        name={tourName}
        family={tourFamily}
        steps={tourSteps}
        continuous
        hideBackButton
      />
      <Card className={classes.root}>
        <CardType
          className={classes.cardType}
          type={DECISION_TYPE}
        />
        <CardActions className={classes.actions}>
          <DialogActions
            isAdmin={myPresence.is_admin}
            isFollowing={myPresence.following}
            marketStage={marketStage}
            marketType={marketType}
            parentMarketId={parentMarketId}
            parentInvestibleId={parentInvestibleId}
            marketId={marketId}
          />
        </CardActions>
        <CardContent className={classes.content}>
          {!isInline && (
            <>
              <Typography className={classes.title} variant="h3" component="h1">
                {marketName}
              </Typography>
              <DescriptionOrDiff
              id={marketId}
              description={description}
              />
              <Divider />
            </>
          )}
          <dl className={metaClasses.root}>
            <div className={clsx(metaClasses.group, metaClasses.expiration)}>
              {activeMarket && (
                <dt>
                  <FormattedMessage id="decisionExpiration" />
                </dt>
              )}
              <dd>
                {activeMarket ? (
                  <ExpiresDisplay
                    createdAt={createdAt}
                    expirationMinutes={expirationMinutes}
                    showEdit={isAdmin}
                    history={history}
                    marketId={marketId}
                  />
                ) : (
                  <ExpiredDisplay
                    expiresDate={updatedAt}
                  />
                )}
              </dd>
            </div>
            {marketPresences && (
              <>
              <div className={clsx(metaClasses.group, metaClasses.assignments)}>
                <dt>
                  <FormattedMessage id="author" />
                </dt>
                <dd>
                  <Collaborators
                    marketPresences={marketPresences}
                    authorId={createdBy}
                    intl={intl}
                    authorDisplay
                  />
                </dd>
              </div>
              <div className={clsx(metaClasses.group, metaClasses.assignments)}>
                <dt>
                  <FormattedMessage id="dialogParticipants" />
                </dt>
                <dd>
                  <Collaborators
                    marketPresences={marketPresences}
                    authorId={createdBy}
                    intl={intl}
                    marketId={marketId}
                    history={history}
                  />
                </dd>
              </div>
              </>
            )}
            <ParentSummary market={market} hidden={hidden}/>
          </dl>
        </CardContent>
      </Card>
      {activeMarket && (
        <dl className={metaClasses.root}>
          <div className={clsx(metaClasses.group, metaClasses.assignments)}>
            <ExpandableAction
              onClick={() => navigate(history, formMarketAddInvestibleLink(marketId))}
              icon={<AddIcon />}
              label={intl.formatMessage({ id: addLabelExplanation })}
              openLabel={intl.formatMessage({ id: addLabel })}
            />
          </div>
        </dl>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubSection
            id="currentVoting"
            type={SECTION_TYPE_SECONDARY}
            title={intl.formatMessage({ id: 'decisionDialogCurrentVotingLabel' })}
          >
            <CurrentVoting
              marketPresences={marketPresences}
              investibles={underConsideration}
              marketId={marketId}
              comments={investibleComments}
              inArchives={inArchives}
            />
          </SubSection>
        </Grid>
        {!_.isEmpty(proposed) && (
          <Grid item xs={12} style={{ marginTop: '56px' }}>
            <SubSection
              type={SECTION_TYPE_SECONDARY}
              title={intl.formatMessage({ id: 'decisionDialogProposedOptionsLabel' })}
            >
              <ProposedIdeas
                investibles={proposed}
                marketId={marketId}
                comments={investibleComments}
              />
            </SubSection>
          </Grid>
        )}
        <Grid item xs={12} style={{ marginTop: '71px' }}>
          {!inArchives && (
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
  // eslint-disable-next-line react/forbid-prop-types
  market: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  investibles: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  comments: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  marketStages: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  marketPresences: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
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
