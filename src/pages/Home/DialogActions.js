import React from 'react';
import PropTypes from 'prop-types';
import DismissMarketButton from './DismissMarketButton';
import HideMarketButton from './HideMarketButton';
import ShowMarketButton from './ShowMarketButton';
import { PLANNING_TYPE } from '../../constants/markets';
import { makeStyles } from '@material-ui/core';
import { navigate } from '../../utils/marketIdPathFunctions';
import { useHistory } from 'react-router';

const useStyles = makeStyles(() => {
  return {
    buttonHolder: {
      display: 'flex',
      flexDirection: 'row',
    },
  };
});

function DialogActions(props) {
  const history = useHistory();

  const {
    marketId,
    marketStage,
    marketType,
    isAdmin,
    inArchives,
  } = props;

  const classes = useStyles();

  function goHome() {
    navigate(history, '/');
  }

  function getActions() {
    const actions = [];
    if (isAdmin) {
      if (marketStage === 'Active') {
        actions.push(
          <DismissMarketButton key="archive" marketId={marketId}/>,
        );
      }
      if (!inArchives && (marketType === PLANNING_TYPE || marketStage !== 'Active')) {
        actions.push(
          <HideMarketButton key="leave" marketId={marketId} onClick={goHome}/>,
        );
      } else if (inArchives) {
        actions.push(
          <ShowMarketButton key="enter" marketId={marketId}/>,
        );
      }
    } else if (!inArchives) {
      actions.push(
        <HideMarketButton key="leave" marketId={marketId} onClick={goHome}/>,
      );
    } else {
      actions.push(
        <ShowMarketButton key="enter" marketId={marketId}/>
      );
    }

    return actions;
  }

  return (
    <div className={classes.buttonHolder}>
      {getActions()}
    </div>
  );

}

DialogActions.propTypes = {
  marketStage: PropTypes.string.isRequired,
  marketId: PropTypes.string.isRequired,
  marketType: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
  inArchives: PropTypes.bool,
};

DialogActions.defaultProps = {
  isAdmin: false,
  inArchives: false,
};

export default DialogActions;
