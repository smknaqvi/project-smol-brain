import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAppState } from '../state/index';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../media/logo-partial.png';
import styled from 'styled-components';
import { ButtonGroup } from '@material-ui/core';

const LogoImage = styled.img`
  height: 4vh;
`;

const useStyles = makeStyles(() =>
  createStyles({
    topbar: {
      justifyContent: 'space-between',
    },
  })
);

export function Navbar() {
  const { username } = useAppState();
  const classes = useStyles();
  return (
    <div>
      <AppBar color="default" position="static">
        <Toolbar className={classes.topbar}>
          <Button
            startIcon={<LogoImage src={logo} alt="logo" />}
            component={RouterLink}
            to="/"
          >
            <Typography variant="h6">YouTube Party</Typography>
          </Button>

          {username ? (
            <Button color="inherit" component={RouterLink} to="/logout">
              Logout
            </Button>
          ) : (
            <ButtonGroup variant="text" disableElevation={true}>
              <Button component={RouterLink} to="/login">
                Login
              </Button>

              <Button component={RouterLink} to="/signup">
                Sign Up
              </Button>
            </ButtonGroup>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
