import createPage from '../createPage';
import { TextField, Box, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useAppState } from '../state';
import { makeStyles } from '@material-ui/core/styles';
import LoadingButton from '../LoadingComponents/LoadingButton';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import background from '../media/tile-background.png';

const useStyles = makeStyles(() => ({
  submit: {
    marginTop: '3%',
    marginBottom: '3%',
    width: '100%',
  },
  field: {
    width: '100%',
    borderColor: 'black',
  },
  //https://stackoverflow.com/questions/57254046/react-makestyles-doesnt-set-background-image
  box: {
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${background})`,
  },
}));
function SignupPage() {
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(
    false
  );
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [
    confirmPasswordErrorMessage,
    setConfirmPasswordErrorMessage,
  ] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { signUp, setError } = useAppState();
  const classes = useStyles();

  function validateForm(username: string, password: string, cpassword: string) {
    let errors = false;
    if (!username) {
      setUsernameErrorMessage('Username cannot be empty');
      setShowUsernameError(true);
      errors = true;
    }
    if (!password) {
      setPasswordErrorMessage('Password cannot be empty');
      setShowPasswordError(true);
      errors = true;
    }
    if (!cpassword) {
      setConfirmPasswordErrorMessage('Password confirmation cannot be empty');
      setShowConfirmPasswordError(true);
      errors = true;
    } else if (cpassword !== password) {
      setConfirmPasswordErrorMessage('Passwords do not match!');
      setShowConfirmPasswordError(true);
      errors = true;
    }
    return errors;
  }
  function handleSubmit(e: React.SyntheticEvent) {
    // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
      cpassword: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    const cpassword = target.cpassword.value;
    const errors = validateForm(username, password, cpassword);

    if (!errors) {
      setIsLoading(true);
      signUp(username, password).catch((err) => {
        setIsLoading(false);
        if (err?.response?.status === 409) {
          setError(new Error('User with that username already exists!'));
        } else {
          setError(
            new Error(
              'Error: Signup unsuccessful. Something went wrong on our end!'
            )
          );
        }
      });
    }
  }

  function clearUsernameErrors() {
    setShowUsernameError(false);
    setUsernameErrorMessage('');
  }

  function clearPasswordErrors() {
    setShowPasswordError(false);
    setPasswordErrorMessage('');
  }

  function clearConfirmPasswordErrors() {
    setShowConfirmPasswordError(false);
    setConfirmPasswordErrorMessage('');
  }

  return (
    // Uncontrolled form, all values passed to us during handleSubmit event
    // https://reactjs.org/docs/uncontrolled-components.html
    <div className={classes.box}>
      <Box display="flex" flexDirection="row" alignItems="center" height="100%">
        <Container maxWidth="xs">
          <Typography variant="h3" align="center">
            Sign Up
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <TextField
                error={showUsernameError}
                helperText={usernameErrorMessage}
                onChange={clearUsernameErrors}
                id="username"
                label="Username"
                variant="outlined"
                className={classes.field}
              />
              <TextField
                error={showPasswordError}
                helperText={passwordErrorMessage}
                onChange={clearPasswordErrors}
                id="password"
                type="password"
                label="Password"
                variant="outlined"
                className={classes.field}
              />
              <TextField
                error={showConfirmPasswordError}
                helperText={confirmPasswordErrorMessage}
                onChange={clearConfirmPasswordErrors}
                id="cpassword"
                type="password"
                label="Confirm Password"
                variant="outlined"
                className={classes.field}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                className={classes.submit}
                loading={isLoading}
                color="primary"
              >
                Sign Up
              </LoadingButton>
            </Box>
          </form>
          <Link href="/login" variant="body2">
            {'Already have an account? Sign in'}
          </Link>
        </Container>
      </Box>
    </div>
  );
}

export default createPage(SignupPage);
