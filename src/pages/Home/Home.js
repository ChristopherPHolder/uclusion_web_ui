import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Screen from '../../containers/Screen/Screen';
import { MarketsContext } from '../../contexts/MarketsContext/MarketsContext';
import { getMarketDetailsForType } from '../../contexts/MarketsContext/marketsContextHelper';
import PlanningDialogs from './PlanningDialogs';
import SubSection from '../../containers/SubSection/SubSection';
import { useIntl } from 'react-intl';
import Notifications from '../../components/Notifications/Notifications';
import DecisionDialogs from './DecisionDialogs';
import DecisionAdd from './DecisionAdd';
import { makeStyles } from '@material-ui/core';
import DecisionAddActionButton from './DecisionAddActionButton';


const useStyles = makeStyles(() => {
  return {
    breadCrumbImage: {
      height: 40,
    },
  };
});

function Home(props) {
  const { hidden } = props;
  const intl = useIntl();
  const classes = useStyles();
  const [marketsState] = useContext(MarketsContext);
  const planningDetails = getMarketDetailsForType(marketsState, 'PLANNING');
  const decisionDetails = getMarketDetailsForType(marketsState, 'DECISION');


  const [decisionAddMode, setDecisionAddMode] = useState(false);

  function toggleDecisionAddMode() {
    setDecisionAddMode(!decisionAddMode);
  }

  const sidebarActions = [<DecisionAddActionButton key="decisionAdd" onClick={toggleDecisionAddMode} />];


  if (decisionAddMode) {
    return (
      <Screen
        title={<img src="/images/Uclusion_Wordmark_Color.png" alt="Uclusion" className={classes.breadCrumbImage} />}
        hidden={hidden}
        appBarContent={<Notifications />}
      >
        <DecisionAdd
          onCancel={toggleDecisionAddMode}
          onSave={toggleDecisionAddMode}
        />
      </Screen>
    );
  }

  return (
    <Screen
      title={<img src="/images/Uclusion_Wordmark_Color.png" alt="Uclusion" className={classes.breadCrumbImage}/>}
      hidden={hidden}
      sidebarActions={sidebarActions}
      appBarContent={<Notifications />}
    >
      <SubSection
        title={intl.formatMessage({ id: 'homeSubsectionPlanning' })}
      >
        <PlanningDialogs markets={planningDetails} />
      </SubSection>
      <SubSection
        title={intl.formatMessage({ id: 'homeSubsectionDecision' })}
      >
        <DecisionDialogs markets={decisionDetails} />
      </SubSection>
    </Screen>
  );

}

Home.propTypes = {
  hidden: PropTypes.bool.isRequired,
};

export default Home;
