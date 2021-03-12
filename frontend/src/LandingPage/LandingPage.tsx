import createPage from '../createPage';
import { useState } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import JoinPartyDialog from '../Dialogs/JoinPartyDialog';
import CreatePartyDialog from '../Dialogs/CreatePartyDialog';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: '20px',
    minWidth: '35%',
    minHeight: '20%',
    color: 'white',
    borderColor: 'white',
    fontSize: '40px',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  icon: {
    minWidth: '60px',
    minHeight: '60px',
  },
}));

function LandingPage() {
  // https://material-ui.com/components/dialogs/
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();

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
  const goToParty = (partyID: string) => {
    // only go to parties if ure vaccinated
    history.replace(`/party/${partyID}`);
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
        joinParty={goToParty}
      ></JoinPartyDialog>
      <CreatePartyDialog
        isOpen={createDialogOpen}
        closeFunction={handleCreateDialogClose}
        createParty={goToParty}
      ></CreatePartyDialog>

      <Button
        variant="outlined"
        color="primary"
        className={classes.margin}
        endIcon={<PeopleIcon className={classes.icon}></PeopleIcon>}
        onClick={handleJoinDialogOpen}
      >
        Join a Party
      </Button>
      <Button
        variant="outlined"
        color="primary"
        className={classes.margin}
        endIcon={<PersonIcon className={classes.icon}></PersonIcon>}
        onClick={handleCreateDialogOpen}
      >
        Create a new Party
      </Button>
    </Box>
  );
}

export default createPage(LandingPage);
