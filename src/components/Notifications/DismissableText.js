import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { DISMISS, DismissTextContext } from '../../contexts/DismissTextContext';
import Button from '@material-ui/core/Button';
import LiveHelpOutlinedIcon from '@material-ui/icons/LiveHelpOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.grey["300"],
    borderRadius: 6,
  },
  leftMost: {
    margin: theme.spacing(1)
  },
  helpIcon: {
    fill: theme.palette.primary.dark
  },
  helpMessage: {
    flexGrow: 1,
    margin: theme.spacing(1, 1, 1, 0),
    fontSize: 18,
    '& p': {
      marginTop: 2
    }
  },
  dismissText: {
    margin: theme.spacing(1)
  },
  dismissButton: {
    fontSize: 12,
    textTransform: 'none',
    textDecoration: 'underline'
  },
  dismissIcon: {
    marginLeft: theme.spacing(-0.5),
    fill: theme.palette.primary.dark
  }
}));

function DismissableText(props) {
  const {
    textId,
  } = props;
  const classes = useStyles();
  const [dismissState, dispatchDismissState] = useContext(DismissTextContext);

  function dismiss() {
    dispatchDismissState({ type: DISMISS, id: textId });
  }

  if (textId in dismissState) {
    return React.Fragment;
  }

  return (
    <div className={classes.root}>

      <div className={classes.leftMost}>
        <LiveHelpOutlinedIcon className={classes.helpIcon} />
      </div>

      <div className={classes.helpMessage}>
        <p><FormattedMessage id={textId} /></p>
      </div>

      <div className={classes.dismissText}>
        <Button
          endIcon={<CancelIcon className={classes.dismissIcon} />}
          className={classes.dismissButton}
          size="small"
          onClick={dismiss}>
          <FormattedMessage id="decisionDialogsDismissDialog" />
        </Button>
      </div>

    </div>
  );
}

DismissableText.propTypes = {
  textId: PropTypes.string.isRequired,
};

export default DismissableText;
