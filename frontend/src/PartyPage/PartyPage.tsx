import { useState, useCallback } from 'react';
import { Box, ButtonGroup, withStyles } from '@material-ui/core';
import createPage from '../createPage';
import PartyPlayer from '../VideoPlayer/PartyPlayer';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { Snackbar } from '@material-ui/core';
import Alert from '../Alert/Alert';
import { useParty } from './PartyContextProvider';
import InvalidPartyDialog from '../Dialogs/InvalidPartyDialog';
import InvalidPartyPasswordDialog from '../Dialogs/InvalidPartyPasswordDialog';
import { makeStyles } from '@material-ui/core/styles';

const ClipboardToolTip = withStyles(() => ({
  tooltip: {
    fontSize: 15,
  },
}))(Tooltip);

const useStyles = makeStyles(() => ({
  partyPageBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
}));

function PartyPage() {
  const [numUsers, setNumUsers] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { partyID, isInvalidPassword, isInvalidID, password } = useParty();

  const classes = useStyles();

  const copyToClipboard = (text: string) => {
    //https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    navigator.clipboard.writeText(text);
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
      <InvalidPartyDialog isOpen={isInvalidID} />
      <InvalidPartyPasswordDialog isOpen={isInvalidPassword} />
      <Box className={classes.partyPageBox}>
        <ButtonGroup>
          <ClipboardToolTip title="Copy to clipboard" placement="bottom">
            <Button
              onClick={() => copyToClipboard(partyID)}
              variant="outlined"
              endIcon={<FileCopyIcon />}
            >
              {partyID}
            </Button>
          </ClipboardToolTip>
          {password && (
            <ClipboardToolTip title="Copy to clipboard" placement="bottom">
              <Button
                onClick={() => copyToClipboard(password)}
                variant="outlined"
                endIcon={<FileCopyIcon />}
              >
                ••••
              </Button>
            </ClipboardToolTip>
          )}
        </ButtonGroup>

        {`Party Size: ${numUsers}`}
      </Box>
      <PartyPlayer handleEvent={handleSocketEvent} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
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
