// cribbed from stripe example
// https://github.com/stripe/react-stripe-js/blob/90b7992c5232de7312d0fcc226541b62db95017b/examples/hooks/1-Card-Detailed.js
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Paper, TextField, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import SpinningButton from '../../components/SpinBlocking/SpinningButton';
import { makeStyles } from '@material-ui/core/styles';
import { AccountContext } from '../../contexts/AccountContext/AccountContext';
import { getPaymentInfo, updatePaymentInfo } from '../../api/users';
import {
  updateBilling,
  updateAccount,
  getCurrentBillingInfo
} from '../../contexts/AccountContext/accountContextHelper';
// this is used to style the Elements Card component
const CARD_OPTIONS = {
  iconStyle: 'solid',

};

// this is the styling for OUR components
const useStyles = makeStyles(theme => ({

  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#3f6b72',
    color: '#fff',
  },
}));

const EMPTY_DETAILS = { name: '', email: '', phone: '' };

function CardInputForm (props) {

  const { onUpdate, onSubmit, submitLabelId } = props;

  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const intl = useIntl();

  const [accountState, accountDispatch] = useContext(AccountContext);
  const [cardComplete, setCardComplete] = useState(false);
  // we have to manage our own processing state because it's a form submit
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [billingDetails, setBillingDetails] = useState(EMPTY_DETAILS);
  const billingDetailsValid = !_.isEmpty(billingDetails.name)
    && !_.isEmpty(billingDetails.email)
    && !_.isEmpty(billingDetails.phone);
  const billingInfo = getCurrentBillingInfo(accountState);
  const validForm = stripe && elements && cardComplete && !error && billingDetailsValid;

  function resetForm () {
    setError(null);
    setProcessing(false);
    setBillingDetails(EMPTY_DETAILS);
  }

  function myOnSubmit (e) {
    e.preventDefault();
    if (!stripe || !elements) {
      return; //abort
    }
    if (error) {
      elements.getElement('card').focus();
      return;
    }
    if (cardComplete) {
      setProcessing(true);
    }
    const updateBillingSubmit = (paymentResult) => {
     return updatePaymentInfo(paymentResult.paymentMethod.id)
        .then((upgradedAccount) => {
          updateAccount(accountDispatch, upgradedAccount);
          return getPaymentInfo();
        }).then((info) => {
        updateBilling(accountDispatch, info);
        resetForm();
        onUpdate();
      });
    };

    const usedSubmit = (onSubmit)? onSubmit : updateBillingSubmit;

    return stripe.createPaymentMethod(({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: billingDetails
    })).then((paymentResult) =>{
      // console.log('Payment method creation successful');
      return usedSubmit(paymentResult, resetForm);
    }).catch((e) => {
      setError(e.error || e.error_message);
      setProcessing(false);
    });
  }

  function onBillingDetailsChange (name) {
    return (event) => {
      const { target: { value } } = event;
      setBillingDetails({
        ...billingDetails,
        [name]: value,
      });
    };
  }

  function onCardChange (e) {
    // should probably handle error state here too, e.g. invalid numbers
    setCardComplete(e.complete);
  }

  function renderCurrentBillingInfo () {
    if (_.isEmpty(billingInfo)) {
      return <React.Fragment/>;
    }

    const cardInfos = billingInfo.map(cardInfo => {
      const {
        brand,
        last4,
        exp_month: expMonth,
        exp_year: expYear
      } = cardInfo;
      return (
        <Typography>
          {brand}: ****-{last4} {expMonth}/{expYear}
        </Typography>
      );
    });

    return (
      <Paper>
        <Typography>
          Current Cards:
        </Typography>
        {cardInfos}
      </Paper>
    );
  }

  return (
    <div>
      {renderCurrentBillingInfo()}
      <div>
        Error Info: {error}
      </div>
      <form
        className={classes.form}
        autoComplete="off"
        onSubmit={myOnSubmit}

      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CardElement options={CARD_OPTIONS} onChange={onCardChange}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="name"
              name="name"
              variant="outlined"
              required
              fullWidth
              id="name"
              autoFocus
              value={billingDetails.name}
              label={intl.formatMessage({ id: 'upgradeFormCardName' })}
              onChange={onBillingDetailsChange('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              name="email"
              type="email"
              value={billingDetails.email}
              autoComplete="email"
              label={intl.formatMessage({ id: 'upgradeFormCardEmail' })}
              onChange={onBillingDetailsChange('email')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="phone"
              name="phone"
              type="tel"
              value={billingDetails.phone}
              autoComplete="tel"
              label={intl.formatMessage({ id: 'upgradeFormCardPhone' })}
              onChange={onBillingDetailsChange('phone')}
            />
          </Grid>

          <SpinningButton
            spinning={processing}
            fullWidth
            variant="contained"
            className={classes.submit}
            type="submit"
            disabled={!validForm}
          >
            {intl.formatMessage({ id: submitLabelId })}
          </SpinningButton>
        </Grid>
      </form>
    </div>
  );
}

CardInputForm.propTypes = {
  onUpdate: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLabelId: PropTypes.string,
};

CardInputForm.defaultProps = {
  onUpdate: () => {},
  onSubmit: undefined,
  submitLabelId: 'upgradeFormUpgradeLabel',
};
export default CardInputForm;