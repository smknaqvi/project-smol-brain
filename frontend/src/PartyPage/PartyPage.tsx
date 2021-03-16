import createPage from '../createPage';
import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

function PartyPage() {
  const partyID = window.location.pathname.split('/')[2];

  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000', {
      query: {
        partyID: partyID,
      },
    });
    socket.emit('connection');
    socket.on('message', (data: any) => {
      console.log(data);
    });
    //https://www.reddit.com/r/reactjs/comments/ig2jq7/struggling_with_typescript_socketio_cant_return/
    return () => {
      socket.disconnect();
    };
  });

  return <h1>Hello</h1>;
}

export default createPage(PartyPage);
