import { useCallback, useEffect, useState } from 'react';
import useSocket from './useSocket';
import { useHistory } from 'react-router-dom';

export default function usePlayerConnection(
  partyID: string,
  password: string,
  eventHandler: (event: string, ...args: any[]) => void
) {
  const history = useHistory();

  const socket = useSocket(partyID, password);
  const [submittedURL, setSubmittedURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSeekTime, setLastSeekTime] = useState<[number]>([0]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    socket.onAny(eventHandler);
    socket.on('new-connection', (socketID: string) => {
      if (socket.id !== socketID) {
        setNotice('New user joined! Video paused.');
      }
      setIsPlaying(false);
    });

    socket.on('connect_error', () => {
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
      setSubmittedURL(url);
    });
  }, [socket, history, eventHandler]);

  const handlePlay = useCallback(
    (timestamp: number): void => {
      socket.emit('play', timestamp);
      setIsPlaying(true);
    },
    [socket]
  );

  const handlePause = useCallback(
    (timestamp: number): void => {
      socket.emit('pause', timestamp);
      // do not set last seek time in here it will cause infinte jitter
      setIsPlaying(false);
    },
    [socket]
  );

  const handleSetURL = useCallback(
    (url: string): void => {
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
    handleSetURL,
    handleSetNotice,
  };
}
