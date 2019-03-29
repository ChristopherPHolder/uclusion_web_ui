/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { DeleteForever } from '@material-ui/icons';
import {
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { getClient } from '../../config/uclusionClient';
import { ERROR, sendIntlMessage } from '../../utils/userMessage';
import { withMarketId } from '../PathProps/MarketId';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  link: {
    textDecoration: 'none',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  email: {
    marginBottom: theme.spacing.unit,
  },
});

function InvestmentsListItem(props) {
  const {
    investible,
    quantity,
    classes,
    userIsOwner,
  } = props;
  const [calculatedQuantity, setCalculatedQuantity] = useState(quantity);
  useEffect(() => {
    const { marketId } = props;
    if (calculatedQuantity === 0) {
      const clientPromise = getClient();
      clientPromise.then(client => client.markets.deleteInvestments(marketId, investible.id))
        .catch((error) => {
          setCalculatedQuantity(quantity);
          console.log(error);
          sendIntlMessage(ERROR, { id: 'refundFailed' });
        });
    }
    return () => {};
  }, [calculatedQuantity]);
  return (
    <Paper className={classes.paper}>
      <div className={classes.content}>
        <div className={classes.infoContainer}>
          <Typography className={classes.username}>{investible.name}</Typography>
          <Typography>
            {`uShares invested: ${calculatedQuantity}`}
          </Typography>
          {userIsOwner && (
          <IconButton onClick={() => setCalculatedQuantity(0)}><DeleteForever /></IconButton>
          )}
        </div>
      </div>
    </Paper>
  );
}

InvestmentsListItem.propTypes = {
  investible: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  marketId: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  userIsOwner: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};


export default injectIntl(withStyles(styles)(withMarketId(InvestmentsListItem)));
