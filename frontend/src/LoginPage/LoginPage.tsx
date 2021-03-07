import createPage from '../createPage';
import { Button, TextField, Box } from '@material-ui/core';
import { useState } from 'react';
import { useAppState } from '../state';

function LoginPage() {
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const { signIn, setError } = useAppState();

  const validateForm = (username: string, password: string) => {
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
  };

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
      signIn(username, password).catch((err) => {
        if (err?.response?.status === 401) {
          setError(new Error('Incorrect username or password!'));
        } else {
          setError(
            new Error(
              'Error: Login unsuccessful. Something went wrong on our end!'
            )
          );
        }
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
