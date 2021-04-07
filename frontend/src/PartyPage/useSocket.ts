import { useEffect, useMemo } from 'react';
import { BACKEND_API_URI } from '../constants';
import { io, Socket } from 'socket.io-client';

export default function useSocket(partyID: string, password: string): Socket {
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
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
}
