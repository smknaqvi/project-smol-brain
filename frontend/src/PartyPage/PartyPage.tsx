import { useState, useCallback } from 'react';
import { Box, withStyles } from '@material-ui/core';
import createPage from '../createPage';
import PartyPlayer from '../VideoPlayer/PartyPlayer';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { Snackbar } from '@material-ui/core';
import Alert from '../Alert/Alert';
import { useParty } from './PartyContextProvider';

const ClipboardToolTip = withStyles(() => ({
  tooltip: {
    fontSize: 15,
  },
}))(Tooltip);

function PartyPage() {
  const [numUsers, setNumUsers] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { partyID } = useParty();

  const copyToClipboard = () => {
    //https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    navigator.clipboard.writeText(partyID);
    setSnackbarOpen(true);
  };

  const handleSocketEvent = useCallback((event: string, ...args: any[]) => {
    switch (event) {
      case 'set-num-users':
        setNumUsers(args[0]);
        break;
    }
  }, []);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="10px"
      >
        <ClipboardToolTip title="Copy to clipboard" placement="right">
          <Button
            onClick={copyToClipboard}
            variant="outlined"
            endIcon={<FileCopyIcon />}
          >
            {partyID}
          </Button>
        </ClipboardToolTip>
        {`Party Size: ${numUsers}`}
      </Box>
      <PartyPlayer handleEvent={handleSocketEvent} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Copied to Clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default createPage(PartyPage);
