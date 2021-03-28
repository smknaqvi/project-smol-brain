import { Server, Socket, Handshake } from 'socket.io';
import sharedSession from 'express-socket.io-session';
import { RequestHandler } from 'express';
import { getAsync, existsAsync, redisClient } from '../app';

export const ioFunction = (io: Server, session: RequestHandler): void => {
  io.use(sharedSession(session));

  io.on('connection', async (socket: Socket) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log('Username:', (socket.handshake as any).session?.username);
    console.log(`Client ${socket.id} connected`);

    const partyID = socket.handshake.query['partyID'] as string;
    const roomExists = await existsAsync(partyID);
    if (!roomExists) {
      console.log('disconnecting');
      io.to(socket.id).emit('error', 'Unauthorized');
      //socket.disconnect();
    } else {
      const url = await getAsync(partyID, 'current_url');
      if (url) {
        io.to(socket.id).emit('url', url);
      }
      console.log('joining up');
      //create new room and redirect, but check permissions
      socket.join(partyID);

      io.sockets.to(partyID).emit('new-connection', socket.id);
    }

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
      redisClient.hset(partyID, 'current_url', url);

      io.sockets.in(partyID).emit('url', encodeURI(url));
    });

    socket.on('disconnect', () => {
      const roomParticipants = io.sockets.adapter.rooms.get(partyID);
      if (!roomParticipants || !roomParticipants.size) {
        redisClient.del(partyID);
      }
      console.log(`Client ${socket.id} disconnected`);
    });
  });
};
