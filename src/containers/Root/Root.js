import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { defaultTheme } from '../../config/themes';
import Market from '../../pages/DecisionDialog/Market';
import About from '../../pages/About/About';
import PageNotFound from '../../pages/PageNotFound/PageNotFound';
import {
  broadcastView, formMarketLink, getMarketId, navigate,
} from '../../utils/marketIdPathFunctions';
import { getAccountClient, getMarketClient } from '../../api/uclusionClient';
import { ERROR, sendIntlMessage } from '../../utils/userMessage';
import Home from '../../pages/Home/Home';

const useStyles = makeStyles({
  body: {
    height: '100%',
  },
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  content: {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
  hide: {
    display: 'none',
  },
});

function Root(props) {
  console.debug('Root being rerendered');
  const history = useHistory();
  const classes = useStyles();
  const { location } = history;
  const { pathname, hash } = location;
  console.log(`pathname is ${pathname}`);
  const marketId = getMarketId(pathname);
  function hideHome() {
    return !pathname || pathname !== '/';
  }

  function hideAbout() {
    if (!pathname) {
      return true;
    }
    return !pathname.startsWith('/about');
  }
  function hideMarket() {
    return marketId === null;
  }
  function isInvite() {
    if (!pathname) {
      return false;
    }
    return pathname.startsWith('/invite') || pathname.startsWith('/slack');
  }
  const inviteMarketId = getMarketId(pathname, '/invite/');
  if (inviteMarketId) {
    console.log(`Logging into market ${inviteMarketId}`);
    getMarketClient(inviteMarketId).then(() => navigate(history, formMarketLink(inviteMarketId)))
      .catch((error) => {
        console.error(error);
        sendIntlMessage(ERROR, { id: 'marketFetchFailed' });
      });
  }
  if (hash) {
    const values = queryString.parse(hash);
    const { nonce } = values;
    if (nonce) {
      getAccountClient()
        .then((client) => client.users.register(nonce))
        .then(() => navigate(history, '/dialogs'))
        .catch((error) => {
          console.error(error);
          sendIntlMessage(ERROR, { id: 'slack_register_failed' });
        });
    }
  }

  useEffect(() => {
    function pegView(isEntry) {
      const currentHref = window.location.href;
      const hashStart = currentHref.indexOf('#');
      if (hashStart > -1) {
        const values = queryString.parse(currentHref.substring(hashStart));
        const { investible } = values;
        const path = currentHref.substring(currentHref.indexOf('/dialog/'), hashStart);
        const marketId = getMarketId(path);
        broadcastView(marketId, investible, isEntry);
      }
    }
    // Need this or won't see events where url doesn't change
    const focusListener = window.addEventListener('focus', () => {
      pegView(true);
    });
    const blurListener = window.addEventListener('blur', () => {
      pegView(false);
    });
    window.onanimationiteration = console.debug;
    return () => {
      if (focusListener) {
        focusListener.remove();
      }
      if (blurListener) {
        blurListener.remove();
      }
    };
  }, []);

  console.log(`Hide Home ${hideHome()}`);
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={classes.body}>
        <div className={classes.root}>
          <div className={isInvite() ? classes.hide : classes.content}>
            <Home hidden={hideHome()} />
            <Market hidden={hideMarket()} />
            <About hidden={hideAbout()} />
            <PageNotFound hidden={!(hideMarket() && hideAbout() && hideHome())}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

Root.propTypes = {
  appConfig: PropTypes.object.isRequired, // eslint-disable-line
};

export default Root;
