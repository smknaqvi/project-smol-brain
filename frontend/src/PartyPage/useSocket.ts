import { useEffect, useRef, useState } from 'react';
import { BACKEND_API_URI } from '../constants';
import { io, Socket } from 'socket.io-client';
import { useHistory } from 'react-router';

export default function useSocket(
  partyID: string,
  password: string
): {
  socket: Socket;
  isInvalidID: boolean;
  isInvalidPassword: boolean;
} {
  const history = useHistory();

  const socketRef = useRef(
    io(BACKEND_API_URI, {
      query: {
        partyID,
      },
      auth: {
        password,
      },
      withCredentials: true,
    })
  );

  const [isInvalidID, setIsInvalidID] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(
      'connect_error',
      (err: { data: { type: string } } | undefined) => {
        const type = err?.data?.type;
        if (type) {
          switch (type) {
            case 'invalid-id':
              setIsInvalidID(true);
              break;
            case 'invalid-password':
              setIsInvalidPassword(true);
              break;
            default:
              history.replace('/');
          }
        } else {
          history.replace('/');
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [history]);

  return { socket: socketRef.current, isInvalidID, isInvalidPassword };
}
