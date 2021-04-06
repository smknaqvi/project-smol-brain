import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import { useState } from 'react';
import LoadingButton from '../LoadingComponents/LoadingButton';

interface DialogPropsInterface {
  closeFunction: () => void;
  createParty: (password: string) => void;
  isOpen: boolean;
  isLoading: boolean;
}

function CreatePartyDialog({
  closeFunction,
  createParty,
  isOpen,
  isLoading,
}: DialogPropsInterface) {
  const [password, setPassword] = useState('');
  return (
    <Dialog
      open={isOpen}
      onClose={closeFunction}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create a party</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Click create to create a new room and join it. Once created you will
          be given a room id.
        </DialogContentText>
        <TextField
          label="Room Password (Optional)"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          type="password"
          fullWidth={true}
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
          onClick={() => createParty(password)}
          color="primary"
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CreatePartyDialog;
