import { useEffect, useMemo } from 'react';
import { BACKEND_API_URI } from '../constants';
import socketIOClient from 'socket.io-client';

export default function useSocket(): SocketIOClient.Socket {
  const socket = useMemo(
    (): SocketIOClient.Socket =>
      socketIOClient(BACKEND_API_URI, {
        query: {
          partyID: window.location.pathname.split('/')[2],
        },
      }),
    []
  );

  useEffect(() => {
    socket.emit('connection');

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
}
