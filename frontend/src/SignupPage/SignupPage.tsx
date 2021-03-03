import createPage from '../createPage';
import { Button, TextField, Box } from '@material-ui/core';
import { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { BACKEND_API_URI } from '../constants';
import { Redirect } from 'react-router';
import axios from 'axios';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SignupPage() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarError, setSnackbarError] = useState('');
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
      axios
        .post(
          BACKEND_API_URI + '/auth/signup',
          { username, password },
          { withCredentials: true }
        )
        .then((res) => {
          setLoginStatus(true);
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setSnackbarError('User with that username already exists!');
          } else {
            setSnackbarError(
              'Error: Signup unsuccessful. Something went wrong on our end!'
            );
          }
          setLoginStatus(false);
          setShowSnackbar(true);
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {loginStatus ? <Redirect to="/" /> : null}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="error">
          {snackbarError}
        </Alert>
      </Snackbar>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column">
          <TextField
            error={showUsernameError}
            helperText={usernameErrorMessage}
            onChange={clearUsernameErrors}
            id="username"
            label="Username"
          />
          <TextField
            error={showPasswordError}
            helperText={passwordErrorMessage}
            onChange={clearPasswordErrors}
            id="password"
            type="password"
            label="Password"
          />
          <TextField
            error={showConfirmPasswordError}
            helperText={confirmPasswordErrorMessage}
            onChange={clearConfirmPasswordErrors}
            id="cpassword"
            type="password"
            label="Confirm Password"
          />
          <Button type="submit">Sign Up</Button>
        </Box>
      </form>
    </Box>
  );
}

export default createPage(SignupPage);
