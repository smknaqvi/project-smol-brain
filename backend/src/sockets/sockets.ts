import { Server, Socket, Handshake } from 'socket.io';
import sharedSession from 'express-socket.io-session';
import { RequestHandler } from 'express';

export const ioFunction = (
  io: Server,
  urls: Map<string, string>,
  session: RequestHandler
): void => {
  io.use(sharedSession(session));

  io.on('connection', (socket: Socket) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log('Username:', (socket.handshake as any).session?.username);
    console.log(`Client ${socket.id} connected`);
    const partyID = socket.handshake.query['partyID'] as string;
    if (urls.has(partyID)) {
      io.to(socket.id).emit('url', urls.get(partyID));
    }
    //create new room and redirect, but check permissions
    socket.join(partyID);

    io.sockets.to(partyID).emit('new-connection', socket.id);

    socket.on('play', (timestamp: number) => {
      console.log(`Client ${socket.id} plays ${timestamp}`);
      io.sockets.in(partyID).emit('play', timestamp);
    });

    socket.on('pause', (timestamp: number) => {
      console.log(`Client ${socket.id} pause ${timestamp}`);
      io.sockets.in(partyID).emit('pause', timestamp);
    });

    socket.on('url', (url: string) => {
      console.log(`Client ${socket.id} set url to ${url}`);
      urls.set(partyID, url);
      io.sockets.in(partyID).emit('url', encodeURI(url));
    });

    socket.on('disconnect', () => {
      const roomParticipants = io.sockets.adapter.rooms.get(partyID);
      if (!roomParticipants || !roomParticipants.size) {
        urls.delete(partyID);
      }
      console.log(`Client ${socket.id} disconnected`);
    });
  });
};
