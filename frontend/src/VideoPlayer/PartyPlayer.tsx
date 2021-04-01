import { useState } from 'react';
import YoutubeIFrame from './YoutubeIFrame';
import { Snackbar } from '@material-ui/core';
import Alert from '../Alert/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Send from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import usePlayerConnection from '../hooks/usePlayerConnection';
import InvalidPartyDialog from '../Dialogs/InvalidPartyDialog';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';
import { withStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const ClipboardToolTip = withStyles((theme: Theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}))(Tooltip);

const useStyles = makeStyles(() => ({
  form: {
    margin: '1% 0',
  },
  helperText: {
    margin: '0 1%',
  },
  videoPlayer: {},
}));

function RTCPlayerWrapper() {
  const [youtubeURL, setYoutubeURL] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  //https://stackoverflow.com/a/46616104
  const partyID = window.location.pathname.split('/')[2];

  const copyToClipboard = () => {
    //https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
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
  const classes = useStyles();

  const {
    notice,
    submittedURL,
    isPlaying,
    lastSeekTime,
    handlePlay,
    handlePause,
    handleProgress,
    handleSetURL,
    handleSetNotice,
    invalidPartyID,
  } = usePlayerConnection();
  if (!invalidPartyID) {
    return (
      <Grid
        container
        spacing={5}
        direction="column"
        alignItems="center"
        alignContent="center"
      >
        <ClipboardToolTip title="Copy to clipboard" placement="bottom">
          <Button
            onClick={copyToClipboard}
            variant="outlined"
            endIcon={<FileCopyIcon />}
          >
            {partyID}
          </Button>
        </ClipboardToolTip>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            Copied to Clipboard
          </Alert>
        </Snackbar>
        <FormControl className={classes.form} fullWidth>
          <InputLabel
            className={classes.helperText}
            htmlFor="filled-adornment-url"
          >
            URL To Youtube Video
          </InputLabel>
          <FilledInput
            id="filled-adornment-url"
            type="text"
            value={youtubeURL}
            onChange={(e) => setYoutubeURL(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="set youtube url"
                  onClick={() => handleSetURL(youtubeURL)}
                  edge="end"
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Grid item xl={'auto'}>
          <YoutubeIFrame
            url={submittedURL}
            isPlaying={isPlaying}
            lastSeekTime={lastSeekTime}
            playbackRate={1}
            handlePlay={handlePlay}
            handlePause={handlePause}
            handleProgress={handleProgress}
          />
        </Grid>
        <Snackbar
          open={!!notice}
          autoHideDuration={6000}
          onClose={() => handleSetNotice('')}
        >
          <Alert onClose={() => handleSetNotice('')} severity="info">
            {notice}
          </Alert>
        </Snackbar>
      </Grid>
    );
  } else {
    return <InvalidPartyDialog isOpen={invalidPartyID} />;
  }
}

export default RTCPlayerWrapper;
