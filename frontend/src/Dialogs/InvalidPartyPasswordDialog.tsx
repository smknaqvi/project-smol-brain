import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

interface DialogPropsInterface {
  isOpen: boolean;
}

function InvalidPartyPasswordDialog({ isOpen }: DialogPropsInterface) {
  const history = useHistory();

  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Invalid Party ID</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The password you have given does not match the party's password. If
          you think you made a mistake you can try joining the party again.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            history.push({
              pathname: `/`,
            });
          }}
          color="primary"
        >
          Home
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InvalidPartyPasswordDialog;
