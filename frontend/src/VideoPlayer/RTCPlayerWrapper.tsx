import { useCallback, useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import YoutubeIFrame from './YoutubeIFrame';
import { once } from 'lodash';
import { BACKEND_API_URI } from '../constants';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const createSocket = once((partyID) =>
  socketIOClient(BACKEND_API_URI, {
    query: {
      partyID,
    },
  })
);

function RTCPlayerWrapper() {
  const [youtubeURL, setYoutubeURL] = useState('');
  const partyID = window.location.pathname.split('/')[2];
  const [submittedURL, setSubmittedURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSeekTime, setLastSeekTime] = useState<[number]>([100]);

  const socket = createSocket(partyID);

  useEffect(() => {
    socket.emit('connection');

    socket.on('new-connection', (data: any) => {
      console.log(data);
    });

    socket.on('play', (timestamp: number) => {
      setLastSeekTime([timestamp]);
      setIsPlaying(true);
    });

    socket.on('pause', () => {
      setIsPlaying(false);
    });

    socket.on('url', (url: string) => {
      console.log('RECEIVED URL');
      setSubmittedURL(url);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSetURL = (url: string) => {
    console.log(`Set URL: ${url}`);
    socket.emit('url', url);
    setSubmittedURL(url);
  };

  const handlePlay = useCallback(
    (timestamp) => {
      console.log(`PLAY:${timestamp}`);
      socket.emit('play', timestamp);
      setIsPlaying(true);
    },
    [socket]
  );

  const handlePause = useCallback(
    (timestamp) => {
      console.log('Pause');
      socket.emit('pause', timestamp);
      // do not set last seek time in here
      setIsPlaying(false);
    },
    [socket]
  );

  const handleProgress = useCallback((timestamp) => {
    console.log('Progress', timestamp);
  }, []);

  return (
    <div className="party-page">
      <TextField
        //https://stackoverflow.com/a/49427475
        onChange={(e) => setYoutubeURL(e.target.value)}
        required
        autoFocus
        margin="dense"
        id="youtubeurl"
        label="URL to Youtube Video"
        type="string"
        fullWidth
      />
      <Button onClick={(e) => handleSetURL(youtubeURL)}>Start</Button>
      <YoutubeIFrame
        url={submittedURL}
        isPlaying={isPlaying}
        lastSeekTime={lastSeekTime}
        playbackRate={1}
        handlePlay={handlePlay}
        handlePause={handlePause}
        handleProgress={handleProgress}
      />
    </div>
  );
}

export default RTCPlayerWrapper;
