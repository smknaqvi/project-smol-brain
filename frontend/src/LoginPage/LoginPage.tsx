import createPage from '../createPage';
import { Button, TextField, Box } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { BACKEND_API_URI } from '../constants';
import { Redirect } from 'react-router';
import axios from 'axios';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function LoginPage() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarError, setSnackbarError] = useState('');
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    axios
      .post(BACKEND_API_URI + '/auth/login', {}, { withCredentials: true })
      .then((res) => {
        if (mounted) setLoginStatus(true);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [loginStatus]);

  function validateForm(username: string, password: string) {
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
    return errors;
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };

    const username = target.username.value;
    const password = target.password.value;
    const errors = validateForm(username, password);
    if (!errors) {
      axios
        .post(
          BACKEND_API_URI + '/auth/login',
          { username, password },
          { withCredentials: true }
        )
        .then((res) => {
          setLoginStatus(true);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setSnackbarError('Incorrect username or password!');
          } else {
            setSnackbarError(
              'Error: Login unsuccessful. Something went wrong on our end!'
            );
          }
          setLoginStatus(false);
          setShowSnackbar(true);
        });
    }
  };

  const clearUsernameErrors = () => {
    setShowUsernameError(false);
    setUsernameErrorMessage('');
  };

  const clearPasswordErrors = () => {
    setShowPasswordError(false);
    setPasswordErrorMessage('');
  };

  if (loginStatus) {
    return <Redirect to="/" />;
  }

  return (
    // Uncontrolled form, all values passed to us during handleSubmit event
    // https://reactjs.org/docs/uncontrolled-components.html
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
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
          <Button type="submit">Login</Button>
        </Box>
      </form>
    </Box>
  );
}

export default createPage(LoginPage);
