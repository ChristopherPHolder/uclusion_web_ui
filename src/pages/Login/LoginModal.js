/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  OidcAuthorizer,
  SsoAuthorizer,
  AnonymousAuthorizer,
  CognitoAuthorizer,
} from 'uclusion_authorizer_sdk';
import {
  Button, Dialog, DialogTitle, List, ListItem,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import appConfig from '../../config/config';
import { setUclusionLocalStorageItem } from '../../components/utils';
import { getAuthMarketId, formCurrentMarketLink, getMarketId } from '../../utils/marketIdPathFunctions';
import { postAuthTasks } from '../../utils/fetchFunctions';
import { withBackgroundProcesses } from '../../components/BackgroundProcesses/BackgroundProcessWrapper';

const styles = theme => ({
  button: {
    width: 320,
  },
  input: {
    display: 'block',
    width: 320,
    marginBottom: theme.spacing.unit * 2,
  },
});

let cognitoAuthorizer = null;

function LoginModal(props) {
  const [allowGuestLogin, setAllowGuestLogin] = useState(false);
  const [allowCognitoLogin, setAllowCognitoLogin] = useState(false);
  const [allowUserLogin, setAllowUserLogin] = useState(false);
  const [allowChangePassword, setAllowChangePassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [poolId, setPoolId] = useState('');
  const [clientId, setClientId] = useState('');
  ValidatorForm.addValidationRule('isPasswordMatch', value => (value === newPassword));

  function getDestinationPage(subPath, includeAuthMarket) {
    const currentPage = new URL(window.location.href);
    let authMarketId;
    if (currentPage.search.includes('authMarketId')) {
      const parsed = currentPage.search.substr(currentPage.search.indexOf('authMarketId'));
      authMarketId = parsed.split('=')[1];
    }
    const marketId = includeAuthMarket || !authMarketId ? getMarketId() : authMarketId;
    currentPage.pathname = `/${marketId}/${subPath}`;
    currentPage.search = authMarketId && includeAuthMarket ? `authMarketId=${authMarketId}` : '';
    return currentPage.toString();
  }
  function getLoginParams() {
    const marketId = getAuthMarketId();
    const parsed = new URL(window.location.href);
    const page = parsed.searchParams.get('destinationPage') || 'investibles';
    const newLogin = parsed.searchParams.get('newLogin');
    const destinationPage = getDestinationPage(page, true);
    const redirectUrl = getDestinationPage('post_auth', false);
    const pageUrl = window.location.href;
    const uclusionUrl = appConfig.api_configuration.baseURL;
    console.log(`page = ${page}`);
    console.log(`destinationPage = ${destinationPage}`);
    console.log(`redirectUrl = ${redirectUrl}`);
    return {
      marketId,
      destinationPage,
      redirectUrl,
      pageUrl,
      uclusionUrl,
      newLogin,
      page,
    };
  }
  useEffect(() => {
    const loginParams = getLoginParams();
    const authorizer = new AnonymousAuthorizer(loginParams);
    authorizer.marketLoginInfo().then((response) => {
      setAllowCognitoLogin(response.allow_cognito);
      setAllowGuestLogin(response.allow_anonymous);
      setAllowUserLogin(response.allow_user);
      if (response.allow_cognito) {
        setPoolId(response.user_pool_id);
        setClientId(response.cognito_client_id);
        const { newLogin } = loginParams;
        if (newLogin) {
          setAllowChangePassword(true);
        }
      }
    });
    return () => {};
  }, []);
  function doLoginRedirect(authorizer, loginParams) {
    const { pageUrl, destinationPage, redirectUrl } = loginParams;
    const redirectPromise = authorizer.authorize(pageUrl, destinationPage, redirectUrl);
    redirectPromise.then((location) => {
      console.log(location);
      window.location = location;
    });
  }

  function loginOidc() {
    const loginParams = getLoginParams();
    const authorizer = new OidcAuthorizer(loginParams);
    doLoginRedirect(authorizer, loginParams);
  }

  function loginSso() {
    const loginParams = getLoginParams();
    const authorizer = new SsoAuthorizer(loginParams);
    doLoginRedirect(authorizer, loginParams);
  }

  function cognitoTokenGenerated() {
    const { dispatch, webSocket, history } = props;
    const { marketId, page } = getLoginParams();
    postAuthTasks(cognitoAuthorizer.storedToken, cognitoAuthorizer.getType(), dispatch,
      marketId, cognitoAuthorizer.user, webSocket);
    history.push(page);
  }

  function changePasswordCognito() {
    cognitoAuthorizer.completeNewPasswordChallenge(newPassword)
      .then(() => {
        cognitoTokenGenerated();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function loginCognito() {
    const { marketId, uclusionUrl } = getLoginParams();
    const authorizerConfiguration = {
      username: email,
      password,
      poolId,
      clientId,
      marketId,
      baseURL: uclusionUrl,
    };
    cognitoAuthorizer = new CognitoAuthorizer(authorizerConfiguration);
    cognitoAuthorizer.authorize().then(() => {
      cognitoTokenGenerated();
    }).catch((error) => {
      if ('newPasswordRequired' in error && error.newPasswordRequired) {
        if (newPassword) {
          changePasswordCognito();
        } else {
          setAllowChangePassword(true);
        }
      } else {
        console.log(error);
      }
    });
  }

  function loginAnonymous() {
    const { dispatch, webSocket, history } = props;
    const loginParams = getLoginParams();
    const authorizer = new AnonymousAuthorizer(loginParams);
    authorizer.doPostAuthorize().then((resolve) => {
      const {
        uclusion_token, market_id, user,
      } = resolve;
      postAuthTasks(uclusion_token, authorizer.getType(), dispatch, market_id, user, webSocket);
      history.push(formCurrentMarketLink('investibles'));
    });
  }

  const { intl, classes, ...other } = props;
  return (
    <Dialog onClose={() => null} aria-labelledby="simple-dialog-title" {...other}>
      <DialogTitle id="simple-dialog-title">
        {allowChangePassword ? 'Change Password' : 'Log In'}
      </DialogTitle>
      <div>
        <List>
          {allowCognitoLogin && (
            <ListItem>
              <ValidatorForm onSubmit={loginCognito}>
                <TextValidator
                  className={classes.input}
                  label="Email"
                  name="email"
                  validators={['required', 'isEmail']}
                  errorMessages={['Email is required', 'Email is not valid']}
                  fullWidth
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />
                <TextValidator
                  className={classes.input}
                  label="Password"
                  name="password"
                  type="password"
                  validators={['required']}
                  errorMessages={['Password is required']}
                  fullWidth
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
                {allowChangePassword && (
                <TextValidator
                  className={classes.input}
                  label="New Password"
                  name="new_password"
                  type="password"
                  validators={['required']}
                  errorMessages={['Password is required']}
                  fullWidth
                  value={newPassword}
                  onChange={event => setNewPassword(event.target.value)}
                />
                )}
                {allowChangePassword && (
                <TextValidator
                  className={classes.input}
                  label="Confirm Password"
                  name="confirm_password"
                  type="password"
                  validators={['isPasswordMatch', 'required']}
                  errorMessages={['Passwords do not match', 'Password is required']}
                  fullWidth
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                />
                )}
                <Button
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Login Cognito
                </Button>
              </ValidatorForm>
            </ListItem>
          )}
          <ListItem>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={loginOidc}
            >
              {intl.formatMessage({ id: 'login_admin' })}
            </Button>
          </ListItem>
          {allowUserLogin
            && (
            <ListItem>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={loginSso}
              >
                {intl.formatMessage({ id: 'login_user' })}
              </Button>
            </ListItem>
            )}
          {allowGuestLogin
            && (
              <ListItem>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={loginAnonymous}
                >
                  {intl.formatMessage({ id: 'login_guest' })}
                </Button>
              </ListItem>
            )}
        </List>
      </div>
    </Dialog>
  );
}

LoginModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  webSocket: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mapStateToProps(state) {
  return { ...state };
}

export default withBackgroundProcesses(withStyles(styles)(connect(mapStateToProps,
  mapDispatchToProps)(injectIntl(withRouter(React.memo(LoginModal))))));
