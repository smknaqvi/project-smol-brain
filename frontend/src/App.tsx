import { Switch, Route } from 'react-router-dom';
import { Box, Snackbar } from '@material-ui/core';
import LoginPage from './LoginPage/LoginPage';
import SignupPage from './SignupPage/SignupPage';
import LogoutPage from './LogoutPage/LogoutPage';
import Alert from './Alert/Alert';
import { useAppState } from './state';
import { Navbar } from './Navbar/Navbar';
import LandingPage from './LandingPage/LandingPage';
import PartyPage from './PartyPage/PartyPage';
import { PrivateRoute } from './PrivateRoute/PrivateRoute';
import InvalidRoutePage from './InvalidRoute/InvalidRoutePage';
import CreditsPage from './CreditsPage/CreditsPage';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import WithPasswordPartyPage from './PartyPage/WithPasswordPartyPage';

const useStyles = makeStyles(() =>
  createStyles({
    creditsLink: {
      color: 'white',
    },
    creditsLinkContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '15px',
    },
  })
);

function App() {
  const { error, setError } = useAppState();
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column">
      <nav>
        <Navbar />
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
        <Route path="/credits" exact>
          <CreditsPage />
        </Route>
        <PrivateRoute path="/party/:id">
          <WithPasswordPartyPage>
            <PartyPage />
          </WithPasswordPartyPage>
        </PrivateRoute>
        <PrivateRoute path="/" exact>
          <LandingPage />
        </PrivateRoute>
        <Route>
          <InvalidRoutePage />
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
      <div className={classes.creditsLinkContainer}>
        <a className={classes.creditsLink} href="/credits">
          Credits
        </a>
      </div>
    </Box>
  );
}

export default App;
