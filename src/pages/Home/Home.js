import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Screen from '../../containers/Screen/Screen';
import { MarketsContext } from '../../contexts/MarketsContext/MarketsContext';
import { getActiveMarketDetailsForType } from '../../contexts/MarketsContext/marketsContextHelper';
import PlanningDialogs from './PlanningDialogs';
import SubSection from '../../containers/SubSection/SubSection';
import DecisionDialogs from './DecisionDialogs';
import DecisionAdd from './DecisionAdd';
import DecisionAddActionButton from './DecisionAddActionButton';
import PlanningAdd from './PlanningAdd';
import PlanningAddActionButton from './PlanningAddActionButton';
import InitiativeAddActionButton from './InitiativeAddActionButton';
import { INITIATIVE_TYPE, DECISION_TYPE, PLANNING_TYPE } from '../../constants/markets';
import InitiativeAdd from './InitiativeAdd';
import InitiativeDialogs from './InitiativeDialogs';
import ViewArchiveActionButton from './ViewArchivesActionButton';


const useStyles = makeStyles(() => ({
  breadCrumbImage: {
    height: 40,
  },
}));

function Home(props) {
  const { hidden } = props;
  const classes = useStyles();
  const [marketsState] = useContext(MarketsContext);
  const planningDetails = getActiveMarketDetailsForType(marketsState, PLANNING_TYPE);
  const decisionDetails = getActiveMarketDetailsForType(marketsState, DECISION_TYPE);
  const initiativeDetails = getActiveMarketDetailsForType(marketsState, INITIATIVE_TYPE);
  const [planningAddMode, setPlanningAddMode] = useState(false);
  const [decisionAddMode, setDecisionAddMode] = useState(false);
  const [initiativeAddMode, setInitiativeAddMode] = useState(false);

  function toggleInitiativeAddMode() {
    setInitiativeAddMode(!initiativeAddMode);
  }

  function toggleDecisionAddMode() {
    setDecisionAddMode(!decisionAddMode);
  }

  function togglePlanningAddMode() {
    setPlanningAddMode(!planningAddMode);
  }

  const sidebarActions = [];
  if (!(planningAddMode || decisionAddMode || initiativeAddMode)) {
    sidebarActions.push(<PlanningAddActionButton key="planningAdd" onClick={togglePlanningAddMode} />);
    sidebarActions.push(<DecisionAddActionButton key="decisionAdd" onClick={toggleDecisionAddMode} />);
    sidebarActions.push(<InitiativeAddActionButton key="initiativeAdd" onClick={toggleInitiativeAddMode} />);
    sidebarActions.push(<ViewArchiveActionButton key="archives" />)
  }

  function getContents() {
    if (planningAddMode) {
      return (
        <PlanningAdd
          onCancel={togglePlanningAddMode}
          onSave={togglePlanningAddMode}
        />
      );
    }
    if (decisionAddMode) {
      return (
        <DecisionAdd
          onCancel={toggleDecisionAddMode}
          onSave={toggleDecisionAddMode}
        />
      );
    }

    if (initiativeAddMode) {
      return (
        <InitiativeAdd
          onCancel={toggleInitiativeAddMode}
          onSave={toggleInitiativeAddMode}
        />
      );
    }
    return (
      <>
        <SubSection>
          <PlanningDialogs markets={planningDetails} />
        </SubSection>
        <SubSection>
          <DecisionDialogs markets={decisionDetails} />
        </SubSection>
        <SubSection>
          <InitiativeDialogs markets={initiativeDetails} />
        </SubSection>
      </>
    );
  }

  return (
    <Screen
      title={<img src="/images/Uclusion_Wordmark_Color.png" alt="Uclusion" className={classes.breadCrumbImage} />}
      hidden={hidden}
      sidebarActions={sidebarActions}
    >
      {getContents()}
    </Screen>
  );
}

Home.propTypes = {
  hidden: PropTypes.bool.isRequired,
};

export default Home;
