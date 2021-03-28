import { useCallback, useEffect, useState } from 'react';
import useSocket from './useSocket';
import { useHistory } from 'react-router-dom';

export default function usePlayerConnection() {
  const history = useHistory();

  const socket = useSocket();
  const [submittedURL, setSubmittedURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSeekTime, setLastSeekTime] = useState<[number]>([0]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    socket.on('new-connection', (socketID: any) => {
      if (socket.id !== socketID) {
        setNotice('New user joined! Video paused.');
      }
      setIsPlaying(false);
    });

    socket.on('error', () => {
      console.log('there was an error');
      history.replace('/');
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
  }, [socket]);

  const handlePlay = useCallback(
    (timestamp: number): void => {
      console.log(`Play`);
      socket.emit('play', timestamp);
      setIsPlaying(true);
    },
    [socket]
  );

  const handlePause = useCallback(
    (timestamp: number): void => {
      console.log('Pause');
      socket.emit('pause', timestamp);
      // do not set last seek time in here
      setIsPlaying(false);
    },
    [socket]
  );

  const handleProgress = useCallback((timestamp: number): void => {
    console.log('Progress', timestamp);
  }, []);

  const handleSetURL = useCallback(
    (url: string): void => {
      console.log(`Set URL: ${url}`);
      socket.emit('url', url);
      setSubmittedURL(url);
    },
    [socket]
  );

  const handleSetNotice = useCallback((notice: string): void => {
    setNotice(notice);
  }, []);

  return {
    notice,
    submittedURL,
    isPlaying,
    lastSeekTime,
    handlePlay,
    handlePause,
    handleProgress,
    handleSetURL,
    handleSetNotice,
  };
}
