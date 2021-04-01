import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

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
  isOpen: boolean;
}

function InvalidPartyDialog({ isOpen }: DialogPropsInterface) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div>
      <Dialog open={isOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Invalid Party ID</DialogTitle>
        <DialogContent className={classes.dialogContent}>
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
    </div>
  );
}

export default InvalidPartyDialog;
