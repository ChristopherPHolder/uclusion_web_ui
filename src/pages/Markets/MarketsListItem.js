import React from 'react';
import PropTypes from 'prop-types';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core';
import ExpandMoreIcon  from '@material-ui/icons/ExpandMore';
import { formMarketLink } from '../../utils/marketIdPathFunctions';
import { withRouter } from 'react-router-dom';

function MarketsListItem(props) {

  const { market, history } = props;
  const { name, id } = market;

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography onClick={() => history.push(formMarketLink(id))}>{name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        Test Content
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

MarketsListItem.propTypes = {
  market: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(MarketsListItem);
