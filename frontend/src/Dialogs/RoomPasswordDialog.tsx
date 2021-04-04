import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';

interface DialogPropsInterface {
  closeFunction: () => void;
  password: string;
  onChange: (event: any) => void;
  isOpen: boolean;
}

function RoomPasswordDialog({
  closeFunction,
  password,
  onChange,
  isOpen,
}: DialogPropsInterface) {
  return (
    <Dialog open={isOpen} onClose={closeFunction}>
      <DialogTitle id="form-dialog-title">Enter Password</DialogTitle>
      <DialogContent>
        <DialogContentText>This room is password protected.</DialogContentText>
        <TextField
          label="Room Password"
          value={password}
          onChange={onChange}
          type="password"
          fullWidth={true}
        />
      </DialogContent>
      <DialogActions>
        <Button
          // https://stackoverflow.com/q/40881616
          type="submit" //set the buttom type is submit
          onClick={closeFunction}
          color="primary"
        >
          Enter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoomPasswordDialog;
