import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import queryString from 'query-string';
import TabPanel from '../Tabs/TabPanel';
import useAsyncInvestiblesContext from '../../contexts/useAsyncInvestiblesContext';
import useAsyncCommentsContext from '../../contexts/useAsyncCommentsContext';
import { formInvestibleLink, navigate } from '../../utils/marketIdPathFunctions';
import MarketView from './MarketView';
import MarketEdit from './MarketEdit';
import InvestibleAdd from '../Investibles/InvestibleAdd';
import { getTabsForInvestibles } from './tabHelpers';


function MarketNav(props) {
  const history = useHistory();
  const {
    intl, market,
  } = props;
  const values = queryString.parse(history.location.hash);
  const marketId = market.id;
  const { investible } = values;
  const [selectedTab, setSelectedTab] = useState(undefined);
  const [edit, setEdit] = useState({});
  const { comments, createCommentsHash } = useAsyncCommentsContext();
  const { getCachedInvestibles } = useAsyncInvestiblesContext();
  const investibles = getCachedInvestibles(marketId);
  const marketComments = comments[marketId] || [];
  const marketTargetedComments = marketComments.filter((comment) => !comment.investible_id);
  const commentsHash = createCommentsHash(marketComments);
  const [previousTab, setPreviousTab] = useState();


  function pushTab(tabValue) {
    if (marketId) {
      navigate(history, formInvestibleLink(marketId, tabValue));
    }
  }

  let workAroundSelected = selectedTab;
  if (investible) {
    if (selectedTab !== investible) {
      setPreviousTab(selectedTab);
      workAroundSelected = investible;
      setSelectedTab(workAroundSelected);
    }
  } else {
    // Someone passed us a bad URL so fall back to context tab
    workAroundSelected = 'context';
    pushTab('context');
  }

  function switchTab(event, newValue) {
    pushTab(newValue);
  }

  function cancelEdit(id) {
    return () => {
      setEdit({ [id]: !edit[id] });
    };
  }

  function onAddSave(newId) {
    pushTab(newId);
  }

  function cancelAdd() {
    if (previousTab) {
      pushTab(previousTab);
    } else {
      pushTab('context');
    }
  }


  const invTabs = getTabsForInvestibles(marketId, investibles,
    marketComments, commentsHash, edit, cancelEdit, workAroundSelected);

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={workAroundSelected}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          onChange={switchTab}
        >
          <Tab label={intl.formatMessage({ id: 'marketNavTabContextLabel' })} value="context" />
          {invTabs.tabs}
          <Tab label={intl.formatMessage({ id: 'marketNavTabAddIdeaLabel' })} icon={<AddIcon />} value="add" />
        </Tabs>
      </AppBar>
      <TabPanel index="context" value={workAroundSelected}>
        {edit[marketId] && (
          <MarketEdit
            market={market}
            onSave={cancelEdit(marketId)}
            editToggle={cancelEdit(marketId)}
          />
        )}
        {!edit[marketId] && (
          <MarketView
            market={market}
            comments={marketTargetedComments}
            commentsHash={commentsHash}
            editToggle={cancelEdit(marketId)}

          />
        )}
      </TabPanel>
      {invTabs.tabContent}
      <TabPanel index="add" value={workAroundSelected}>
        <InvestibleAdd marketId={marketId} onSave={onAddSave} onCancel={cancelAdd} />
      </TabPanel>
    </div>
  );
}

MarketNav.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  intl: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  market: PropTypes.object.isRequired,
};

export default injectIntl(MarketNav);
