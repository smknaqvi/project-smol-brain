import { Box } from '@material-ui/core';
import createPage from '../createPage';
import PartyPlayer from '../VideoPlayer/PartyPlayer';
import Tooltip from '@material-ui/core/Tooltip';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '../Alert/Alert';
import { withStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useState } from 'react';

const ClipboardToolTip = withStyles((theme: Theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}))(Tooltip);

function PartyPage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  //https://stackoverflow.com/a/46616104
  const partyID = window.location.pathname.split('/')[2];

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
  return (
    <Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Copied to Clipboard
        </Alert>
      </Snackbar>
      <ClipboardToolTip title="Copy to clipboard" placement="bottom">
        <Button
          onClick={copyToClipboard}
          variant="outlined"
          endIcon={<FileCopyIcon />}
        >
          {partyID}
        </Button>
      </ClipboardToolTip>
      <PartyPlayer />
    </Box>
  );
}

export default createPage(PartyPage);
