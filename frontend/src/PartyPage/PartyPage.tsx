import { Box } from '@material-ui/core';
import createPage from '../createPage';
import PartyPlayer from '../VideoPlayer/PartyPlayer';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '../Alert/Alert';
import { useState } from 'react';

function PartyPage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
      <PartyPlayer />
    </Box>
  );
}

export default createPage(PartyPage);
