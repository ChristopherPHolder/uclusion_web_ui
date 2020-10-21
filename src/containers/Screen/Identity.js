import React, { useContext, useState } from 'react';
import { Avatar, Button, makeStyles, Menu, Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import { useIntl } from 'react-intl';
import { navigate } from '../../utils/marketIdPathFunctions';
import SignOut from '../../pages/Authentication/SignOut';
import { CognitoUserContext } from '../../contexts/CognitoUserContext/CongitoUserContext';
import config from '../../config';
import { isFederated } from '../../contexts/CognitoUserContext/cognitoUserContextHelper';
import md5 from 'md5';

const useStyles = makeStyles((theme) => ({
  name: {
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem'
    },
  },
  menuStyle: {
    position: 'relative',
  },
  terms: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  identityBlock: {
    paddingBottom: theme.spacing(1),
    textAlign: 'center',
  },
  changeAvatar: {
    color: theme.palette.text.secondary,
  },
  termsLink: {
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem'
    },
  },
  buttonClass: {
    backgroundColor: '#efefef',
    textTransform: 'Capitalize',
    borderRadius: '8px',
    '& .MuiButton-label': {
      lineHeight: '.7'
    },
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      minWidth: 'auto',
      '& .MuiButton-endIcon': {
        margin: 0
      }
    },
  },
  signOut: {
    textAlign: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  largeAvatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: theme.spacing(4),
  },
  user: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  }
}));

function Identity (props) {
  const { logoutChannel } = props;
  const classes = useStyles();
  const user = useContext(CognitoUserContext);
  const canChangeUserValues = !isFederated(user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();
  const intl = useIntl();
  const email = !user ? '' : user.email;
  const chipLabel = !user ? '' : (user.name || '');
  const gravatarId = email ? md5(email, { encoding: 'binary' }) : '';
  const recordPositionToggle = (event) => {
    if (anchorEl === null) {
      setAnchorEl(event.currentTarget);
      setMenuOpen(true);
    } else {
      setAnchorEl(null);
      setMenuOpen(false);
    }
  };

  function goTo (to) {
    return () => {
      setAnchorEl(null);
      navigate(history, to);
    };
  }

  const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarId}?d=404`;
  return (
    <div
      id="profileLink"
      style={{ paddingLeft: '2rem' }}
    >
      <Button
        onClick={recordPositionToggle}
        endIcon={<SettingsIcon htmlColor="#bdbdbd"/>}
        className={classes.buttonClass}
      >
        <Avatar key={chipLabel}
                src={gravatarUrl}/>
      </Button>
      <Menu
        id="profile-menu"
        open={menuOpen}
        onClose={recordPositionToggle}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        disableRestoreFocus
      >
        <div className={classes.identityBlock}>
          <Avatar className={classes.largeAvatar} src={gravatarUrl}/>
          <Typography>{chipLabel}</Typography>
          <Typography>{email}</Typography>
          <Link underline="hover"
                href="https://www.gravatar.com"
                className={classes.changeAvatar}
                target="_blank"
          >
            {intl.formatMessage({ id: 'IdentityChangeAvatar' })}
          </Link>
        </div>
        <Divider/>
        <MenuItem
          onClick={goTo('/support')}
        >
          <Typography className={classes.name}>
            {intl.formatMessage({ id: 'support' })}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={goTo('/notificationPreferences')}
        >
          <Typography className={classes.name}>
            {intl.formatMessage({ id: 'changePreferencesHeader' })}
          </Typography>
        </MenuItem>
        {canChangeUserValues && (<MenuItem
          onClick={goTo('/changePassword')}
        >
          <Typography className={classes.name}>
            {intl.formatMessage({ id: 'changePasswordHeader' })}
          </Typography>
        </MenuItem>)}
        {config.payments.enabled && (
          <MenuItem
            onClick={goTo('/billing')}
          >
            <Typography className={classes.name}>
              {intl.formatMessage({ id: 'billingMenuItem' })}
            </Typography>
          </MenuItem>
        )}
        <Divider/>
        <div className={classes.signOut}>
          <SignOut logoutChannel={logoutChannel}/>
        </div>
        <Divider/>
        <div className={classes.terms}>
          <Link
            href={config.termsOfUseLink}
            target="_blank"
            className={classes.termsLink}
            underline="hover"
          >
            {intl.formatMessage({ id: 'IdentityTermsOfUse' })}
          </Link>
        </div>
      </Menu>
    </div>
  );
}

export default Identity;
