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
      flexGrow: 1,
      textAlign: 'left',
    },
    navbar: {
      backgroundColor: 'white',
    },
  })
);

export const Navbar: React.FunctionComponent = () => {
  const { username } = useAppState();
  const classes = useStyles();
  return (
    <div>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            YouTube Party
          </Typography>
          {username ? (
            <Button color="inherit" component={RouterLink} to="/logout">
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/">
              Login / Signup
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
