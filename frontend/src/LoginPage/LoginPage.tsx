import createPage from '../createPage';
import { TextField, Box } from '@material-ui/core';
import { useState } from 'react';
import { useAppState } from '../state';
import LoadingButton from '../LoadingComponents/LoadingButton';

function LoginPage() {
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      signIn(username, password).catch((err) => {
        setIsLoading(false);
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
      <h1>Login</h1>
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
          <LoadingButton type="submit" loading={isLoading}>
            Login
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}

export default createPage(LoginPage);
