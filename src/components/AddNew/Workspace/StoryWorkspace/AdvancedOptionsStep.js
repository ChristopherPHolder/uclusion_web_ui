import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, TextField } from '@material-ui/core'
import { useIntl } from 'react-intl';
import StepButtons from '../../StepButtons';
import { DiffContext } from '../../../../contexts/DiffContext/DiffContext';

import { MarketsContext } from '../../../../contexts/MarketsContext/MarketsContext';
import { InvestiblesContext } from '../../../../contexts/InvestibesContext/InvestiblesContext';
import { MarketPresencesContext } from '../../../../contexts/MarketPresencesContext/MarketPresencesContext';
import { CommentsContext } from '../../../../contexts/CommentsContext/CommentsContext';
import { doCreateStoryWorkspace } from './workspaceCreator';
import { WizardStylesContext } from '../../WizardStylesContext';
import WizardStepContainer from '../../WizardStepContainer';
import Grid from '@material-ui/core/Grid';

import AllowedInProgress from '../../../../pages/Dialog/Planning/AllowedInProgress';
import { VoteExpiration, Votes } from '../../../AgilePlan';
import { makeStyles } from '@material-ui/styles';
import { MarketStagesContext } from '../../../../contexts/MarketStagesContext/MarketStagesContext';
import ShowInVerifiedStageAge from '../../../../pages/Dialog/Planning/ShowInVerifiedStageAge'

const useOptionsStyles = makeStyles(theme => {
  return {
    item: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: '100%',
      '& > *': {
        width: '100%',
      }
    },
    helper: {
      fontStyle: "italic",
      marginBottom: theme.spacing(4),
    }
  };
});

function AdvancedOptionsStep (props) {
  const { updateFormData, formData } = props;
  const intl = useIntl();
  const classes = useContext(WizardStylesContext);
  const [, marketsDispatch] = useContext(MarketsContext);
  const [, marketStagesDispatch] = useContext(MarketStagesContext);
  const [, diffDispatch] = useContext(DiffContext);
  const [, investiblesDispatch] = useContext(InvestiblesContext);
  const [, presenceDispatch] = useContext(MarketPresencesContext);
  const [commentsState, commentsDispatch] = useContext(CommentsContext);

  function createMarket (formData) {
    const dispatchers = {
      marketStagesDispatch,
      diffDispatch,
      investiblesDispatch,
      marketsDispatch,
      presenceDispatch,
      commentsDispatch,
      commentsState,
    };
    return doCreateStoryWorkspace(dispatchers, formData, updateFormData, intl)
      .then((marketId) => {
        return ({ ...formData, marketId });
      });
  }

  function onPrevious () {
    const newValues = {
      advancedOptionsSkipped: false,
    };
    updateFormData(newValues);
  }

  function onNext () {
    const newValues = {
      advancedOptionsSkipped: false,
    };
    updateFormData(newValues);
    return createMarket({ ...formData, ...newValues });
  }

  function onSkip () {
    const newValues = {
      advancedOptionsSkipped: true,
    };
    return createMarket({ ...formData, ...newValues });
  }

  function onTicketSubCodeChange(event) {
    const { value } = event.target;
    updateFormData({
      ticketSubCode: value
    });
  }

  function handleChange (name) {
    return (event) => {
      const { value } = event.target;
      const parsed = parseInt(value, 10);
      updateFormData({
        [name]: parsed,
      });
    };
  }

  const optionsClasses = useOptionsStyles();

  const {
    allowedInvestibles,
    investmentExpiration,
    votesRequired,
    showInvestiblesAge,
    ticketSubCode
  } = formData;

  return (
    <WizardStepContainer
      {...props}
      titleId="OnboardingWizardAdvancedOptionsStepLabel"
    >
      <div>
        <Typography variant="body1" className={optionsClasses.helper}>
          We've set up good defaults for you but you can change core behavior of the workspace if needed.
        </Typography>
        <Card>
        <Grid container spacing={2} direction="column">
          <Grid
            item
            xs={12}
            className={optionsClasses.item}
          >
            <AllowedInProgress
              onChange={handleChange('allowedInvestibles')}
              value={allowedInvestibles}
            />
          </Grid>
          <Grid
            item
            xs={12}
            className={optionsClasses.item}
          >
            <ShowInVerifiedStageAge
              onChange={handleChange('showInvestiblesAge')}
              value={showInvestiblesAge}
            />
          </Grid>
          <Grid
            item
            xs={12}
            className={optionsClasses.item}
          >
            <VoteExpiration
              onChange={handleChange('investmentExpiration')}
              value={investmentExpiration}
            />
          </Grid>
          <Grid
            item
            xs={12}
            className={optionsClasses.item}
          >
            <Votes onChange={handleChange('votesRequired')} value={votesRequired}/>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          className={optionsClasses.item}
        >
          <TextField
            id="name"
            className={classes.input}
            value={ticketSubCode}
            onChange={onTicketSubCodeChange}
          />
          <Typography>
            {intl.formatMessage({ id: "ticketSubCodeHelp" })}
          </Typography>
        </Grid>
        </Card>
        <div className={classes.borderBottom}/>
        <StepButtons
          {...props}
          showSkip
          spinOnClick
          onPrevious={onPrevious}
          onSkip={onSkip}
          onNext={onNext}/>
      </div>
    </WizardStepContainer>
  );
}

AdvancedOptionsStep.propTypes = {
  updateFormData: PropTypes.func,
  formData: PropTypes.object,
};

AdvancedOptionsStep.defaultProps = {
  updateFormData: () => {},
  formData: {},
};

export default AdvancedOptionsStep;