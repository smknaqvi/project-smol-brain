import { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useParty } from '../PartyPage/PartyContextProvider';

export default function usePlayerConnection(
  eventHandler: (event: string, ...args: any[]) => void
) {
  const history = useHistory();

  const { socket } = useParty();

  const [submittedURL, setSubmittedURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSeekTime, setLastSeekTime] = useState<[number]>([0]);
  const [notice, setNotice] = useState('');

  const eventHandlerRef = useRef(eventHandler);

  useEffect(() => {
    const eventHandler = eventHandlerRef.current;

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
  }, [socket, history]);

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
