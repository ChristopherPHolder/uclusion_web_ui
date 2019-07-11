import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IconButton, Button } from '@material-ui/core';

import { createInvestment } from '../../api/marketInvestibles';
import { Add, Remove } from '@material-ui/icons';

const styles = theme => ({

  container: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    width: 100,
  },
  investButton: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  availableShares: {
    fontSize: 14,
    paddingLeft: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    padding: 0,
  },
});

class InvestibleInvest extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      quantityToInvest: props.currentUserInvestment,
      saveEnabled: false,
    };

    this.addClicked = this.addClicked.bind(this);
    this.deleteClicked = this.deleteClicked.bind(this);
    this.updateState = this.updateState.bind(this);
    this.checkQuantity = this.checkQuantity.bind(this);
    this.doInvestment = this.doInvestment.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  doInvestment() {
    const {
      investibleId,
      teamId,
      dispatch,
      currentUserInvestment,
    } = this.props;
    const { quantityToInvest } = this.state;
    const quantity = parseInt(quantityToInvest, 10);
    createInvestment(teamId, investibleId, quantity, currentUserInvestment, dispatch);
  }


  validateQuantityToInvest(quantity) {
    const { sharesAvailable } = this.props;
    return (quantity <= sharesAvailable) && (quantity > 0);
  }


  checkQuantity(newQuantity) {
    const { sharesAvailable } = this.props;
    const numValue = isNaN(newQuantity) ? parseInt(newQuantity, 10) : newQuantity;
    const invalid = (!isNaN(numValue) && (numValue < 0 || numValue > sharesAvailable));
    return !invalid;
  }

  updateState(newQuantity) {
    const valid = this.checkQuantity(newQuantity);
    const { currentUserInvestment } = this.props;
    if (valid) {
      // eslint-disable-next-line eqeqeq
      const saveEnabled = newQuantity != currentUserInvestment;
      this.setState({
        quantityToInvest: newQuantity,
        saveEnabled: saveEnabled,
      });
    }
  }

  handleQuantityChange(event) {
    const { value } = event.target;
    this.updateState(value);
  }

  addClicked() {
    const { quantityToInvest } = this.state;
    const newQuantity = quantityToInvest + 1;
    this.updateState(newQuantity);
  }

  deleteClicked() {
    const { quantityToInvest } = this.state;
    const newQuantity = quantityToInvest - 1;
    this.updateState(newQuantity);
  }

  render() {
    const {
      classes,
      intl,
    } = this.props;
    const { quantityToInvest, saveEnabled } = this.state;

    return (
      <div>

        <form className={classes.container} noValidate autoComplete="off" onSubmit={ e=> e.preventDefault()}>

          <IconButton onClick={this.deleteClicked}>
            <Remove />
          </IconButton>

          <TextField
            id="quantityToInvest"
            label={intl.formatMessage({ id: 'investModalQuantityLabel' })}
            className={classes.textField}
            margin="normal"
            type="number"
            value={quantityToInvest}
            onChange={this.handleQuantityChange}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  style={{ paddingBottom: 4 }}
                  position="start"
                >
                  Ȗ
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={this.addClicked}>
            <Add />
          </IconButton>
          {saveEnabled &&
          <Button
            className={classes.investButton}
            variant="contained"
            color="primary"
            onClick={this.handleInvest}>
            {intl.formatMessage({ id: 'investButton' })}
          </Button>
          }
        </form>
      </div>
    );
  }
}

InvestibleInvest.propTypes = {
  classes: PropTypes.object.isRequired, //eslint-disable-line
  investibleId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  sharesAvailable: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired, //eslint-disable-line
  currentUserInvestment: PropTypes.number.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapDispatchToProps)(injectIntl(withStyles(styles)(InvestibleInvest)));
