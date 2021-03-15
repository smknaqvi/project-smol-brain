import { Switch, Route } from 'react-router-dom';
import { Box, Snackbar } from '@material-ui/core';
import LoginPage from './LoginPage/LoginPage';
import SignupPage from './SignupPage/SignupPage';
import LogoutPage from './LogoutPage/LogoutPage';
import Alert from './Alert/Alert';
import { useAppState } from './state';
import { Navbar } from './Navbar/Navbar';
import { PrivateRoute } from './PrivateRoute/PrivateRoute';
import LandingPage from './LandingPage/LandingPage';
import PartyPage from './PartyPage/PartyPage';

function App() {
  const { error, setError } = useAppState();

  return (
    <Box display="flex" flexDirection="column">
      <nav>
        <Navbar></Navbar>
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
        <Route path="/party/:id">
          <PartyPage></PartyPage>
        </Route>

        <Route path="/" exact>
          <LandingPage></LandingPage>
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
