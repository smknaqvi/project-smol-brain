import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from 'react-router-dom';
import { Link, Box } from '@material-ui/core';
import LoginPage from './LoginPage/LoginPage';
import SignupPage from './SignupPage/SignupPage';
import LogoutPage from './LogoutPage/LogoutPage';

function App() {
  return (
    <Router>
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
            HOMEPAGE
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}

export default App;
