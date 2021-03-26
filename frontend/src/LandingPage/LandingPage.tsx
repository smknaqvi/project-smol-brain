import createPage from '../createPage';
import { useState } from 'react';
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

const useStyles = makeStyles(() => ({
  button: {
    height: '8vh',
    fontSize: '2vh',
    margin: '8px',
  },
}));

function LandingPage() {
  // https://material-ui.com/components/dialogs/
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
  const goToParty = (partyID: string, isNewParty: boolean) => {
    if (!isNewParty) {
      API.get(`/party/${partyID}`)
        .then((res) => {
          history.push({
            pathname: `/party/${partyID}`,
          });
        })
        .catch((err) => {
          setError(new Error('Specified Party ID Does not Exist'));
        });
    } else {
      history.push({
        pathname: `/party/${partyID}`,
      });
    }
  };

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
        goToParty={goToParty}
      />
      <CreatePartyDialog
        isOpen={createDialogOpen}
        closeFunction={handleCreateDialogClose}
        goToParty={goToParty}
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
