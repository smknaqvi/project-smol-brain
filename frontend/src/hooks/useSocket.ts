import { useEffect, useMemo } from 'react';
import { BACKEND_API_URI } from '../constants';
import { io, Socket } from 'socket.io-client';

export default function useSocket(): Socket {
  const socket = useMemo(
    (): Socket =>
      io(BACKEND_API_URI, {
        query: {
          partyID: window.location.pathname.split('/')[2],
        },
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
}
