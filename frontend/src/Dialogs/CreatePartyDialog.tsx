import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '../Alert/Alert';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
// import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

//https://material-ui.com/components/snackbars/#snackbar
// function Alert(props: AlertProps) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }
const ClipboardToolTip = withStyles((theme: Theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
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
  goToParty: (partyID: string) => void;
  isOpen: boolean;
}

function CreatePartyDialog({
  closeFunction,
  goToParty,
  isOpen,
}: DialogPropsInterface) {
  const classes = useStyles();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [partyID, setPartyID] = useState(' ');

  useEffect(() => {
    const uuid = uuidv4();
    setPartyID(uuid);
  }, []);

  const copyToClipboard = () => {
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
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Copied to Clipboard
        </Alert>
      </Snackbar>
      <Dialog
        open={isOpen}
        onClose={closeFunction}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create a party</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            The Number below is your unique party ID. Copy it to your clipboard
            and keep it somewhere safe. This is what you'll use to invite others
            to your party. (It'll also be in the URL of your room).
          </DialogContentText>

          <ClipboardToolTip title="Copy to clipboard" placement="bottom">
            <Button onClick={copyToClipboard} variant="outlined">
              {partyID}
            </Button>
          </ClipboardToolTip>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFunction} color="primary">
            Cancel
          </Button>
          <Button
            // https://stackoverflow.com/q/40881616
            type="submit" //set the buttom type is submit
            onClick={() => {
              goToParty(partyID);
            }}
            color="primary"
            disabled={partyID === ''}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreatePartyDialog;
