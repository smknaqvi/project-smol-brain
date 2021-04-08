import { useEffect, useMemo } from 'react';
import { BACKEND_API_URI } from '../constants';
import { io, Socket } from 'socket.io-client';
import { useHistory } from 'react-router-dom';

export default function useSocket(partyID: string, password: string): Socket {
  const history = useHistory();

  const socket = useMemo(
    (): Socket =>
      io(BACKEND_API_URI, {
        query: {
          partyID,
        },
        auth: {
          password,
        },
        withCredentials: true,
      }),
    [partyID, password]
  );

  useEffect(() => {
    socket.on('connect_error', () => {
      history.replace('/');
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, history]);

  return socket;
}
