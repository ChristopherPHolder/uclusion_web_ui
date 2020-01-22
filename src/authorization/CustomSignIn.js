import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SignIn } from 'aws-amplify-react';
import { injectIntl } from 'react-intl';
import ApiBlockingButton from '../components/SpinBlocking/ApiBlockingButton';

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#3f6b72',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#3f6b72',
    color: '#fff',
  }
});

class CustomSignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
  }

  showComponent() {
    const { classes, intl } = this.props;
    const ALTERNATE_SIDEBAR_LOGO = 'Uclusion_Logo_White_Micro.png';
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <img width="35" height="35" src={`/images/${ALTERNATE_SIDEBAR_LOGO}`} alt="Uclusion" />
          </Avatar>
          <Typography component="h1" variant="h5">
            {intl.formatMessage({ id: 'signInSignIn' })}
          </Typography>
        </div>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            key="username"
            name="username"
            onChange={this.handleInputChange}
            type="email"
            label={intl.formatMessage({ id: 'signInEmailLabel' })}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={intl.formatMessage({ id: 'signInPasswordLabel' })}
            key="password"
            type="password"
            id="password"
            onChange={this.handleInputChange}
            autoComplete="current-password"
          />
          <ApiBlockingButton
            type="button"
            fullWidth
            variant="contained"
            className={classes.submit}
            onClick={() => super.signIn()}
          >
            {intl.formatMessage({ id: 'signInSignIn'})}
          </ApiBlockingButton>
          <Grid container>
            <Grid item xs>
              <Link
                href="#"
                variant="body2"
                onClick={() => super.changeState('forgotPassword', { email: super.getUsernameFromInput() })}
              >
                {intl.formatMessage({ id: 'signInForgotPassword' })}
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => super.changeState('signUp')}
              >
                {intl.formatMessage({ id: 'signInNoAccount' })}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Container>
    );
  }
}

export default withStyles(useStyles)(injectIntl(CustomSignIn));
