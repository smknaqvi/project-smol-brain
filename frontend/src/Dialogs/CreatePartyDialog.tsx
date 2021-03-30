import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  dialogContent: {
    textAlign: 'center',
  },
  PopperProps: {
    fontSize: '20px',
  },
  tooltip: {
    fontSize: '20px',
    popper: {
      fontSize: '20px',
    },
  },
}));
interface DialogPropsInterface {
  closeFunction: () => void;
  goToParty: () => void;
  isOpen: boolean;
}

function CreatePartyDialog({
  closeFunction,
  goToParty,
  isOpen,
}: DialogPropsInterface) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={closeFunction}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create a party</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            When you hit Create, you'll be taken to a room with a unique Party
            ID. Copy it to your clipboard and keep it somewhere safe. This is
            what you'll use to invite others to your party. (It'll also be in
            the URL of your room).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFunction} color="primary">
            Cancel
          </Button>
          <Button
            // https://stackoverflow.com/q/40881616
            type="submit" //set the buttom type is submit
            onClick={goToParty}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreatePartyDialog;
