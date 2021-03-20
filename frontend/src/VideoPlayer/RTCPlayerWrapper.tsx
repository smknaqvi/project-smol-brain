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
  } = usePlayerConnection();

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      alignItems="center"
      alignContent="center"
    >
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
}

export default RTCPlayerWrapper;
