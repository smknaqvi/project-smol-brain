import React from 'react';
import { Switch, Route, Link as RouterLink } from 'react-router-dom';
import { Link, Box, Snackbar } from '@material-ui/core';
import LoginPage from './LoginPage/LoginPage';
import SignupPage from './SignupPage/SignupPage';
import LogoutPage from './LogoutPage/LogoutPage';
import Alert from './Alert/Alert';
import { useAppState } from './state';

function App() {
  const { username, error, setError } = useAppState();

  return (
    <Box display="flex" flexDirection="column">
      <nav>
        <ul>
          <li>
            <Link component={RouterLink} to="/">
              Home
            </Link>
          </li>
          <li>
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link component={RouterLink} to="/signup">
              Signup
            </Link>
          </li>
          <li>
            <Link component={RouterLink} to="/logout">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/signup" exact>
          <SignupPage />
        </Route>
        <Route path="/logout" exact>
          <LogoutPage />
        </Route>
        <Route path="/" exact>
          {username ? `${username} is logged in` : 'please log in'}
        </Route>
      </Switch>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
