import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { updateMarket, updateStage } from '../../../api/markets'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import CardActions from '@material-ui/core/CardActions'
import Card from '@material-ui/core/Card'
import { usePlanFormStyles, VoteExpiration, Votes } from '../../../components/AgilePlan'
import AllowedInProgress from './AllowedInProgress';
import { getStages, updateStagesForMarket } from '../../../contexts/MarketStagesContext/marketStagesContextHelper'
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext'
import _ from 'lodash'
import ShowInVerifiedStageAge from './ShowInVerifiedStageAge'
import { makeStyles, TextField, Typography } from '@material-ui/core'
import ChangeToObserverButton from '../ChangeToObserverButton'
import ChangeToParticipantButton from '../ChangeToParticipantButton'
import { getMarketPresences } from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext'
import SpinningIconLabelButton from '../../../components/Buttons/SpinningIconLabelButton'
import { Clear, SettingsBackupRestore } from '@material-ui/icons'
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext'
import ManageExistingUsers from '../UserManagement/ManageExistingUsers'

const useStyles = makeStyles((theme) => {
  return {
    actions: {
      margin: theme.spacing(-3, 0, 0, 6),
      paddingBottom: '2rem'
    }
  };
});

function PlanningDialogEdit(props) {
  const { onSpinStop, onCancel, market, acceptedStage, verifiedStage } = props;
  const [marketStagesState, marketStagesDispatch] = useContext(MarketStagesContext);
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const {
    id,
    name: initialMarketName,
    max_budget: initialBudget,
    investment_expiration: initialExpiration,
    votes_required: initialVotesRequired
  } = market;
  const marketPresences = getMarketPresences(marketPresencesState, id);
  const myPresence = marketPresences && marketPresences.find((presence) => presence.current_user);
  const following = myPresence ? myPresence.following : false;
  const intl = useIntl();
  const classes = usePlanFormStyles();
  const myClasses = useStyles();
  const [allowedInvestibles, setAllowedInvestibles] = useState(acceptedStage.allowed_investibles);
  const [showInvestiblesAge, setShowInvestiblesAge] = useState(verifiedStage.days_visible);
  const [mutableMarket, setMutableMarket] = useState({
    ...market,
    name: initialMarketName,
    max_budget: initialBudget,
    investment_expiration: initialExpiration,
    votes_required: initialVotesRequired
  });
  const {
    max_budget,
    investment_expiration,
    votes_required,
    ticket_sub_code
  } = mutableMarket;

  function handleChange(name) {
    return event => {
      const { value } = event.target;
      setMutableMarket({ ...mutableMarket, [name]: value });
    };
  }

  function onAllowedInvestiblesChange(event) {
    const { value } = event.target;
    setAllowedInvestibles(parseInt(value, 10));
  }

  function onShowInvestiblesAgeChange(event) {
    const { value } = event.target;
    setShowInvestiblesAge(parseInt(value, 10));
  }

  function updateShowInvestibles() {
    return updateStage(id, verifiedStage.id, undefined, showInvestiblesAge).then((newStage) => {
      const marketStages = getStages(marketStagesState, id);
      const newStages = _.unionBy([newStage], marketStages, 'id');
      updateStagesForMarket(marketStagesDispatch, id, newStages);
      setOperationRunning(false);
    });
  }

  function handleSave() {
    const votesRequiredInt =
      votes_required != null ? parseInt(votes_required, 10) : null;
    const maxBudget = max_budget ? parseInt(max_budget, 10) : 0;
    return updateMarket(
          id,
          null,
          null,
          null,
          maxBudget,
          parseInt(investment_expiration, 10),
          votesRequiredInt,
          null,
          ticket_sub_code
        ).then(market => {
          onSpinStop(market);
          if (allowedInvestibles !== acceptedStage.allowed_investibles) {
            return updateStage(id, acceptedStage.id, allowedInvestibles).then((newStage) => {
              const marketStages = getStages(marketStagesState, id);
              const newStages = _.unionBy([newStage], marketStages, 'id');
              updateStagesForMarket(marketStagesDispatch, id, newStages);
              if (showInvestiblesAge !== verifiedStage.days_visible) {
                return updateShowInvestibles();
              } else {
                setOperationRunning(false);
              }
            });
          }
          if (showInvestiblesAge !== verifiedStage.days_visible) {
            return updateShowInvestibles();
          } else {
            setOperationRunning(false);
          }
        });
  }

  const isDraft = _.size(marketPresences) < 2;

  return (
    <Card className={classes.overflowVisible}>
      <CardContent className={classes.cardContent}>
        <Grid container className={clsx(classes.fieldset, classes.flex, classes.justifySpace)}>
          {!isDraft && (
            <Grid item md={6} xs={12} className={classes.fieldsetContainer}>
              <ManageExistingUsers market={market} />
            </Grid>
          )}
          <Grid item md={isDraft ? 12 : 4} xs={12} className={classes.fieldsetContainer}>
            <Typography variant="h6">
              Archive or Restore Workspace
            </Typography>
            <Typography variant="body2" style={{marginBottom: "0.5rem"}}>
              Archiving prevents notifications and moves the workspace from the home page to the archives.
            </Typography>
            {following && (
              <ChangeToObserverButton key="change-to-observer" marketId={id} />
            )}
            {!following && (
              <ChangeToParticipantButton key="change-to-participant" marketId={id}/>
            )}
          </Grid>
        </Grid>
        <Grid container className={clsx(classes.fieldset, classes.flex, classes.justifySpace)}
              style={{paddingTop: "2rem"}}>
          <Grid item md={12} xs={12} className={classes.fieldsetContainer}>
              <Typography variant="h6">
               Workspace Options
              </Typography>
          </Grid>
          <Grid item md={5} xs={12} className={classes.fieldsetContainer}>
            <AllowedInProgress
              onChange={onAllowedInvestiblesChange}
              value={allowedInvestibles}
            />
          </Grid>
          <Grid item md={5} xs={12} className={classes.fieldsetContainer}>
            <ShowInVerifiedStageAge
              onChange={onShowInvestiblesAgeChange}
              value={showInvestiblesAge}
            />
          </Grid>
          <Grid item md={5} xs={12} className={classes.fieldsetContainer}>
            <VoteExpiration
              onChange={handleChange("investment_expiration")}
              value={investment_expiration}
            />
          </Grid>
          <Grid item md={5} xs={12} className={classes.fieldsetContainer}>
            <Votes onChange={handleChange("votes_required")} value={votes_required} />
          </Grid>
          <Grid item md={5} xs={12} className={classes.fieldsetContainer}>
            <TextField
              id="name"
              className={classes.input}
              value={ticket_sub_code}
              onChange={handleChange("ticket_sub_code")}
            />
            <Typography>
              {intl.formatMessage({ id: "ticketSubCodeHelp" })}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={myClasses.actions}>
        <SpinningIconLabelButton onClick={onCancel} doSpin={false} icon={Clear}>
          {intl.formatMessage({ id: 'marketAddCancelLabel' })}
        </SpinningIconLabelButton>
        <SpinningIconLabelButton onClick={handleSave} icon={SettingsBackupRestore} id="planningDialogUpdateButton"
                                 disabled={!(parseInt(investment_expiration, 10) > 0)}>
          {intl.formatMessage({ id: 'marketEditSaveLabel' })}
        </SpinningIconLabelButton>
      </CardActions>
    </Card>
  );
}

PlanningDialogEdit.propTypes = {
  market: PropTypes.object.isRequired,
  acceptedStage: PropTypes.object.isRequired,
  onSpinStop: PropTypes.func,
  onCancel: PropTypes.func,
};

PlanningDialogEdit.defaultProps = {
  onCancel: () => {},
  onSpinStop: () => {}
};

export default PlanningDialogEdit;
