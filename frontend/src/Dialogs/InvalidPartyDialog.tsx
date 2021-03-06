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

function InvalidPartyDialog({ isOpen }: DialogPropsInterface) {
  const history = useHistory();

  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Invalid Party ID</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The party ID you're looking to join doesn't seem to exist. If you'd
          like to create a new party or join an existing one, go to the home
          page and try again.
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

export default InvalidPartyDialog;
