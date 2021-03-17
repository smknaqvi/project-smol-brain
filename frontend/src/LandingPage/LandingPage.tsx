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
import API from '../utils/API';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '../Alert/Alert';

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const classes = useStyles();
  const history = useHistory();

  //https://material-ui.com/components/snackbars/#snackbar
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

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
          setSnackbarOpen(true);
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          Specified Party ID Does not Exist
        </Alert>
      </Snackbar>
      <JoinPartyDialog
        isOpen={joinDialogOpen}
        closeFunction={handleJoinDialogClose}
        goToParty={goToParty}
      ></JoinPartyDialog>
      <CreatePartyDialog
        isOpen={createDialogOpen}
        closeFunction={handleCreateDialogClose}
        goToParty={goToParty}
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
