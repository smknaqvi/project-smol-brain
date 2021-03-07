import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAppState } from '../state/index';
import { Link as RouterLink } from 'react-router-dom';

//https://material-ui.com/components/app-bar/
//https://codesandbox.io/s/e7qoz
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'left',
      //https://stackoverflow.com/a/56158634
      textDecoration: 'inherit',
      color: 'inherit',
    },
    navbar: {
      backgroundColor: 'white',
    },
    topbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

export const Navbar: React.FunctionComponent = () => {
  const { username } = useAppState();
  const classes = useStyles();
  return (
    <div>
      <AppBar className={classes.navbar} position="static">
        <Toolbar className={classes.topbar}>
          <div>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              className={classes.title}
            >
              YouTube Party
            </Typography>
          </div>
          <div>
            {username ? (
              <Button color="inherit" component={RouterLink} to="/logout">
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>

                <Button color="inherit" component={RouterLink} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
