import { TextField, Box, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useAppState } from '../state';
import LoadingButton from '../LoadingComponents/LoadingButton';
import { makeStyles } from '@material-ui/core/styles';
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

function LoginPage() {
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setError } = useAppState();
  const classes = useStyles();

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
    <div className={classes.box}>
      <Box display="flex" flexDirection="row" alignItems="center" height="100%">
        <Container maxWidth="xs">
          <Typography variant="h3" align="center">
            Login
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
              <LoadingButton
                type="submit"
                loading={isLoading}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Login
              </LoadingButton>
            </Box>
          </form>
          <Link href="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Container>
      </Box>
    </div>
  );
}

export default LoginPage;
