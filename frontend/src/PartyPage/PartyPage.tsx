import { Box } from '@material-ui/core';
import createPage from '../createPage';
import PartyPlayer from '../VideoPlayer/PartyPlayer';
import InvalidPartyDialog from '../Dialogs/InvalidPartyDialog';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';
import { withStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Snackbar } from '@material-ui/core';
import Alert from '../Alert/Alert';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import API from '../utils/API';
import RoomPasswordDialog from '../Dialogs/RoomPasswordDialog';

interface LocationState {
  isValidated?: boolean;
  hasPassword?: boolean;
  password?: string;
}

const ClipboardToolTip = withStyles((theme: Theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}))(Tooltip);

function PartyPage() {
  const history = useHistory();
  const partyID = history.location.pathname.split('/')[2];

  const locationState = history.location.state as LocationState | undefined;
  const [isValidated, setIsValidated] = useState(!!locationState?.isValidated);
  const [hasPassword, setHasPassword] = useState(!!locationState?.hasPassword);
  const [password, setPassword] = useState(locationState?.password || '');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isInvalidID, setIsInvalidID] = useState(false);

  useEffect(() => {
    if (!isValidated) {
      API.get(`/party/${partyID}`)
        .then((res) => {
          setHasPassword(res.data.hasPassword);
          setIsPasswordDialogOpen(res.data.hasPassword && !password);
        })
        .catch(() => {
          setIsInvalidID(true);
        })
        .finally(() => {
          setIsValidated(true);
        });
    } else if (!isPasswordDialogOpen) {
      setIsPasswordDialogOpen(hasPassword && !password);
    }
  }, [
    hasPassword,
    isPasswordDialogOpen,
    isValidated,
    locationState,
    partyID,
    password,
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const copyToClipboard = () => {
    //https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    navigator.clipboard.writeText(partyID);
    setSnackbarOpen(true);
  };
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

  if (!isValidated) {
    return <p>Loading</p>;
  }

  if (isPasswordDialogOpen) {
    return (
      <RoomPasswordDialog
        isOpen={isPasswordDialogOpen}
        password={password}
        onChange={({ target: { value } }) => {
          setPassword(value);
        }}
        closeFunction={() => setIsPasswordDialogOpen(false)}
      />
    );
  }

  return (
    <Box>
      <InvalidPartyDialog isOpen={isInvalidID} />
      <ClipboardToolTip title="Copy to clipboard" placement="bottom">
        <Button
          onClick={copyToClipboard}
          variant="outlined"
          endIcon={<FileCopyIcon />}
        >
          {partyID}
        </Button>
      </ClipboardToolTip>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Copied to Clipboard
        </Alert>
      </Snackbar>
      <PartyPlayer password={password} partyID={partyID} />
    </Box>
  );
}

export default createPage(PartyPage);
