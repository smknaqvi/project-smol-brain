import { useState } from 'react';
import YoutubeIFrame from './YoutubeIFrame';
import { Box, Snackbar } from '@material-ui/core';
import Alert from '../Alert/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Send from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import usePlayerConnection from '../hooks/usePlayerConnection';
import Chat from '../Chat/Chat';

const useStyles = makeStyles(() => ({
  form: {
    margin: '1% 0',
  },
  helperText: {
    margin: '0 1%',
  },

  videoChatContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chat: {
    padding: '5px',
    margin: '10px',
    width: '40vh',
    border: '1px solid white',
    borderRadius: '20px',
  },
}));

interface RTCPlayerWrapperProps {
  handleEvent: (event: string, ...args: any[]) => void;
}

function PartyPlayer({ handleEvent }: RTCPlayerWrapperProps) {
  const [youtubeURL, setYoutubeURL] = useState('');

  const classes = useStyles();

  const {
    notice,
    submittedURL,
    isPlaying,
    lastSeekTime,
    handlePlay,
    handlePause,
    handleSetURL,
    handleSetNotice,
  } = usePlayerConnection(handleEvent);

  return (
    <Box
      display="flex"
      flexDirection="column"
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
      <Box className={classes.videoChatContainer}>
        <YoutubeIFrame
          url={submittedURL}
          isPlaying={isPlaying}
          lastSeekTime={lastSeekTime}
          playbackRate={1}
          handlePlay={handlePlay}
          handlePause={handlePause}
        />
        <div className={classes.chat}>
          <Chat />
        </div>
      </Box>
      <Snackbar
        open={!!notice}
        autoHideDuration={6000}
        onClose={() => handleSetNotice('')}
      >
        <Alert onClose={() => handleSetNotice('')} severity="info">
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PartyPlayer;
