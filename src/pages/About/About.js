import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import {
  Paper, Typography, Button, makeStyles,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import Screen from '../../containers/Screen/Screen';
import config from '../../config';
import { toastErrorAndThrow } from '../../utils/userMessage';
import { getSSOInfo } from '../../api/sso';
import { makeBreadCrumbs } from '../../utils/marketIdPathFunctions';
import ChangePassword from '../Authentication/ChangePassword';
import ChangeNotificationPreferences from './ChangeNotificationPreferences';
import SignOut from '../Authentication/SignOut';
import FeatureRequest from './FeatureRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  section: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  row: {
    display: 'flex',
    marginBottom: theme.spacing(0.5),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  label: {
    fontWeight: 600,
    marginRight: theme.spacing(1),
    minWidth: 140,
  },
  value: {
    //
  },
}));

function About(props) {
  const {
    hidden,
  } = props;
  const intl = useIntl();
  const history = useHistory();
  const classes = useStyles();
  const { version } = config;
  const [externalId, setExternalId] = useState(undefined);
  const [user, setUser] = useState(undefined);
  function handleClear() {
    localforage.clear().then(() => {
      console.info('Reloading after clearing cache');
      window.location.reload(true);
    }).catch((error) => toastErrorAndThrow(error, 'errorClearFailed'));
  }

  useEffect(() => {
    if (!externalId && !hidden) {
      getSSOInfo().then((ssoInfo) => {
        const { idToken, ssoClient } = ssoInfo;
        return ssoClient.accountCognitoLogin(idToken).then((loginInfo) => {
          const { user: myUser } = loginInfo;
          setUser(myUser);
          const { external_id: myExternalId } = myUser;
          setExternalId(myExternalId);
        });
      }).catch((error) => toastErrorAndThrow(error, 'errorGetIdFailed'));
    }
  }, [externalId, hidden]);
  const breadCrumbs = makeBreadCrumbs(history, [], true);
  return (
    <div>
      <Screen
        title={intl.formatMessage({ id: 'about' })}
        tabTitle={intl.formatMessage({ id: 'about' })}
        hidden={hidden}
        breadCrumbs={breadCrumbs}
        loading={!externalId}
      >
        <div className={classes.root}>
          <Paper className={classes.section}>
            <Typography className={classes.row}>
              <span className={classes.label}>{intl.formatMessage({ id: 'aboutApplicationVersionLabel' })}</span>
              <span className={classes.value}>{version}</span>
            </Typography>
          </Paper>
          <Paper className={classes.section}>
            <Typography className={classes.row}>
              <span className={classes.label}>{intl.formatMessage({ id: 'aboutUserIdLabel' })}</span>
              <span className={classes.value}>{externalId}</span>
            </Typography>
          </Paper>
          <Paper className={classes.section}>
            <Typography className={classes.row}>
              {intl.formatMessage({ id: 'supportInfoText' })}
            </Typography>
          </Paper>
          <FeatureRequest />
          <a
            href={config.add_to_slack_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
            />
          </a>
          <br />
          <Button onClick={handleClear}>{intl.formatMessage({ id: 'aboutClearStorageButton' })}</Button>
          <br />
          <ChangePassword />
          <br />
          {user && (
            <ChangeNotificationPreferences user={user} />
          )}
          <br />
          <SignOut />
        </div>
      </Screen>
    </div>
  );
}

About.propTypes = {
  hidden: PropTypes.bool.isRequired,
};

export default About;
