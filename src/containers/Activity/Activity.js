/* eslint-disable react/forbid-prop-types */
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { DrawerContext } from '../../contexts/DrawerContext';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 12,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...theme.mixins.toolbar,
  },
  availableShares: {
    paddingRight: theme.spacing(4),
  },
  content: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
  },
  contentShift: {
    // width: `calc(100% - ${drawerWidth}px)`,
    // transition: theme.transitions.create(['width', 'margin'], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.enteringScreen,
    // }),
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  grow: {
    flex: '1 1 auto',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: theme.spacing(2),
  },
  marketSelect: {
    color: 'inherit',
    fontSize: 20,
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 20,
  },
  formLabel: {
    color: 'inherit',
    position: 'relative',
    top: -1,
    marginRight: theme.spacing(1),
    fontSize: 20,
  },
  formControl: {
    minWidth: 1,
  },
  selectArrow: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 'calc(50% - 12px)',
    right: 0,
  },
  selectEmpty: {
    marginTop: 5,
  },
  offline: {
    textAlign: 'center',
    height: theme.spacing(2),
    padding: theme.spacing(0.5),
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
  },
});

function Activity(props) {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [drawerState, setDrawerState] = useContext(DrawerContext);
  const { open } = drawerState;

  function toggleDrawerOpen() {
    setDrawerState({ open: !open });
  }

  function handleConnectionStatusChange() {
    setOffline(!navigator.onLine);
  }

  window.addEventListener('online', handleConnectionStatusChange);
  window.addEventListener('offline', handleConnectionStatusChange);

  const {
    classes,
    theme,
    children,
    intl,
    title,
    pageTitle,
    width,
    appBarContent,
    onBackClick,
    titleButtons,
    containerStyle,
    hidden,
  } = props;
  let headerTitle = '';

  if (typeof title === 'string' || title instanceof String) {
    headerTitle = title;
  }

  if (pageTitle) {
    headerTitle = pageTitle;
  }

  console.debug(`Activity being rerendered for ${title}`);

  // const smDown = width === 'sm' || width === 'xs'
  const smDown = isWidthDown('sm', width);

  const appBarClassName = (width !== 'sm' && width !== 'xs')
    ? classNames(classes.appBar, open && classes.appBarShift)
    : classes.appBar;
  const contentClassName = (width !== 'sm' && width !== 'xs')
    ? classNames(classes.content, open && classes.contentShift)
    : classes.content;

  return (
    <div className={hidden ? classes.hide : classes.root}>
      <Helmet>
        <meta name="theme-color" content={theme.palette.primary.main}/>
        <meta name="apple-mobile-web-app-status-bar-style" content={theme.palette.primary.main}/>
        <meta name="msapplication-navbutton-color" content={theme.palette.primary.main}/>
        <title>{headerTitle}</title>
      </Helmet>

      <AppBar
        position={(width !== 'sm' && width !== 'xs') ? 'absolute' : undefined}
        className={appBarClassName}
        color='default'
      >
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawerOpen}
            className={classNames(!smDown && classes.menuButton,
              open && !smDown && classes.hide, onBackClick && classes.hide)}
          >
            <MenuIcon/>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onBackClick}
            className={classNames(!smDown && classes.menuButton, !onBackClick && classes.hide)}
          >
            <ChevronLeftIcon/>
          </IconButton>
          {!onBackClick && open && <div style={{ marginRight: 32 }}/>}
          <Typography variant="h6" color="inherit" noWrap>
            {headerTitle}
          </Typography>
          {titleButtons}
          {appBarContent}
          <div className={classes.grow}/>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar}/>
      {offline && (
        <Typography
          variant="caption"
          className={classes.offline}
          noWrap
        >
          {intl.formatMessage({ id: 'offline' })}
        </Typography>
      )}
      <main className={contentClassName} style={containerStyle}>
        {children}
      </main>
    </div>
  );
}

Activity.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,

  children: PropTypes.object,
  intl: PropTypes.object.isRequired,
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  width: PropTypes.string.isRequired,
  appBarContent: PropTypes.object,
  onBackClick: PropTypes.object,
  containerStyle: PropTypes.object,
};


export default withWidth()(withStyles(styles, { withTheme: true })(injectIntl(withRouter(React.memo(Activity)))));

