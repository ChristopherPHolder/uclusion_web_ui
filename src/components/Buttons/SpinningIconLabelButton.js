/** A simple button that when spinning is true, ignores it's children
 * for a circular progress indicator
 */
import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { CircularProgress, Button, useTheme } from '@material-ui/core';
import { OperationInProgressContext } from '../../contexts/OperationInProgressContext/OperationInProgressContext'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(
  () => {
    return {
      button: {
        marginRight: '1rem',
        '& .MuiButton-label': {
          textTransform: 'none'
        },
        "&:hover": {
          backgroundColor: "#F1F1F1"
        }
      },
      buttonWhiteBackground: {
        backgroundColor: "#FFF",
        marginRight: '1rem',
        '& .MuiButton-label': {
          textTransform: 'none'
        },
        "&:hover": {
          backgroundColor: "#F1F1F1"
        }
      },
      buttonNoMargin: {
        '& .MuiButton-label': {
          textTransform: 'none'
        },
        "&:hover": {
          backgroundColor: "#F1F1F1"
        }
      },
    }
  },
  { name: "Button" }
);

function SpinningIconLabelButton(props) {
  const {
    disabled,
    doSpin,
    children,
    icon: Icon,
    noMargin,
    onClick,
    whiteBackground,
    iconColor='black',
    id,
    ...rest
  } = props;
  const [operationRunning, setOperationRunning] = useContext(OperationInProgressContext);
  const classes = useStyles();
  const theme = useTheme();
  const spinningDisabled = doSpin && operationRunning !== false;
  const spinning = operationRunning === id;
  function myOnClick() {
    if (onClick) {
      if (doSpin) {
        setOperationRunning(id);
      }
      onClick();
    }
  }
  return (
    <Button
      disabled={spinningDisabled || disabled}
      variant="outlined"
      size="small"
      onClick={myOnClick}
      startIcon={spinningDisabled || disabled ? <Icon color='disabled' /> : <Icon htmlColor={iconColor} />}
      className={noMargin ? classes.buttonNoMargin: whiteBackground ? classes.buttonWhiteBackground : classes.button}
      {...rest}
    >
      {children}
      {spinning && (
        <CircularProgress
          size={theme.typography.fontSize}
          color="inherit"
          style={{position: 'absolute', top: '50%', left: '50%', marginTop: -6, marginLeft: -12}}
        />
      )}
    </Button>
  );
}

SpinningIconLabelButton.propTypes = {
  disabled: PropTypes.bool,
  doSpin: PropTypes.bool,
  icon: PropTypes.object.isRequired
};

SpinningIconLabelButton.defaultProps = {
  disabled: false,
  doSpin: true
};

export default SpinningIconLabelButton;
