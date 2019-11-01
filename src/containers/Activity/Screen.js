import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Notifications from '../../components/Notifications/Notifications';

const useStyles = makeStyles({
  // grow is used to eat up all the space until the right
  grow: {
    flexGrow: 1,
  },
  hidden: {
    display: 'none',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

function Screen(props) {
  const classes = useStyles();

  const { breadCrumbs, hidden, title, children } = props;

  function generateTitle() {
    if (breadCrumbs) {
      return (
        <Breadcrumbs separator=">" >
          {breadCrumbs.map((crumb, index) => {
            return (
              <Link key={index} color="inherit" href="#" onClick={crumb.onClick}>
                {crumb.title}
              </Link>
            );
          })}
          <Typography color="textPrimary">{title}</Typography>
        </Breadcrumbs>
      );
    }
    return (<Typography color="textPrimary">{title}</Typography>);
  }

  return (
    <div className={hidden ? classes.hidden : classes.root }>
      <AppBar
        position="static"
        hidden={hidden}
        color="background"
      >
        <Toolbar>
          {generateTitle()}
          <div className={classes.grow} />
          <Notifications />
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
}

Screen.propTypes = {
  breadCrumbs: PropTypes.arrayOf(PropTypes.object),
  hidden: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

Screen.defaultProps = {
  breadCrumbs: [],
  hidden: false,
};

export default Screen;