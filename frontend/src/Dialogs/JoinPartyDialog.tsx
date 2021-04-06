import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState } from 'react';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import LoadingButton from '../LoadingComponents/LoadingButton';

interface DialogPropsInterface {
  closeFunction: () => void;
  joinParty: (partyID: string) => void;
  isOpen: boolean;
  isLoading: boolean;
}

function JoinPartyDialog({
  closeFunction,
  joinParty,
  isOpen,
  isLoading,
}: DialogPropsInterface) {
  const [partyID, setPartyID] = useState('');

  return (
    <Dialog
      open={isOpen}
      onClose={closeFunction}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Join a party</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your unique party ID below. This should be in the form of
          a long string of letters and characters.
        </DialogContentText>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <YouTubeIcon />
              </InputAdornment>
            ),
          }}
          value={partyID}
          //https://stackoverflow.com/a/49427475
          onChange={(e) => setPartyID(e.target.value)}
          required
          autoFocus
          id="partyID"
          label="Party ID"
          type="string"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeFunction} color="primary">
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          // https://stackoverflow.com/q/40881616
          type="submit" //set the buttom type is submit
          onClick={() => {
            joinParty(partyID);
          }}
          color="primary"
          disabled={partyID.trim().length === 0}
        >
          Join
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default JoinPartyDialog;
