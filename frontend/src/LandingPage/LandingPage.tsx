import createPage from '../createPage';
import { useCallback, useState } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';
import JoinPartyDialog from '../Dialogs/JoinPartyDialog';
import CreatePartyDialog from '../Dialogs/CreatePartyDialog';
import API from '../utils/API';
import { useAppState } from '../state';
import logo from '../media/logo-full.png';
import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// https://developer.mozilla.org/en-US/docs/Web/CSS/calc()
const useStyles = makeStyles(() => ({
  button: {
    height: 'calc(40px + 4.5vh)',
    fontSize: 'calc(12px + 1vh)',
    margin: '8px',
  },
}));

function LandingPage() {
  // https://material-ui.com/components/dialogs/
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { setError } = useAppState();
  const classes = useStyles();

  const handleJoinDialogOpen = () => {
    setJoinDialogOpen(true);
  };
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleJoinDialogClose = () => {
    setJoinDialogOpen(false);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const createParty = useCallback(
    (password = '') => {
      setIsLoading(true);
      API.put(`/party/new`, { password })
        .then((res) => {
          const partyID = res.data.partyID;
          history.push({
            pathname: `/party/${partyID}`,
            state: {
              isValidated: true,
              hasPassword: res.data.hasPassword,
              password: password || undefined,
            },
          });
        })
        .catch(() => {
          setIsLoading(false);
          setError(
            new Error(
              'Something went wrong on our end, could not create party.'
            )
          );
        });
    },
    [history, setError]
  );

  const joinParty = useCallback(
    (partyID: string) => {
      setIsLoading(true);
      API.get(`/party/${partyID}`)
        .then((res) => {
          history.push({
            pathname: `/party/${partyID}`,
            state: {
              isValidated: true,
              hasPassword: res.data.hasPassword,
            },
          });
        })
        .catch(() => {
          setIsLoading(false);
          setError(new Error('Invalid Party ID or Room Password'));
        });
    },
    [history, setError]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <JoinPartyDialog
        isOpen={joinDialogOpen}
        closeFunction={handleJoinDialogClose}
        joinParty={joinParty}
        isLoading={isLoading}
      />
      <CreatePartyDialog
        isOpen={createDialogOpen}
        closeFunction={handleCreateDialogClose}
        createParty={createParty}
        isLoading={isLoading}
      />
      <img src={logo} alt="Logo" />
      <ButtonGroup
        size="large"
        orientation="vertical"
        color="primary"
        variant="contained"
        disableElevation={true}
      >
        <Button
          className={classes.button}
          endIcon={<PeopleIcon />}
          onClick={handleJoinDialogOpen}
        >
          Join a Party
        </Button>
        <Button
          endIcon={<PersonIcon />}
          className={classes.button}
          onClick={handleCreateDialogOpen}
        >
          Create a new Party
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default createPage(LandingPage);
