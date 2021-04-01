import { Server, Socket, Handshake } from 'socket.io';
import sharedSession from 'express-socket.io-session';
import { RequestHandler } from 'express';
import { get, exists, set, del } from '../app';

export const ioFunction = (io: Server, session: RequestHandler): void => {
  io.use(sharedSession(session));

  io.on('connection', async (socket: Socket) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log('Username:', (socket.handshake as any).session?.username);
    console.log(`Client ${socket.id} connected`);

    const partyID = socket.handshake.query['partyID'] as string;
    const roomExists = await exists(partyID);
    if (!roomExists) {
      io.to(socket.id).emit('error', 'Unauthorized');
    } else {
      const url = await get(partyID, 'current_url');
      if (url) {
        io.to(socket.id).emit('url', url);
      }
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

    socket.on('url', async (url: string) => {
      console.log(`Client ${socket.id} set url to ${url}`);
      await set(partyID, 'current_url', url);
      io.sockets.in(partyID).emit('url', encodeURI(url));
    });

    socket.on('disconnect', async () => {
      console.log('disconnecting');
      let numParticipants = io.sockets.adapter.rooms.get(partyID)?.size;
      if (!numParticipants) {
        const delay = 60000;
        setTimeout(() => {
          numParticipants = io.sockets.adapter.rooms.get(partyID)?.size;
          if (!numParticipants) {
            del(partyID)
              .then(() => {
                console.log(
                  `Deleted empty room after ${delay / 1000} second(s)`
                );
              })
              .catch((err) => {
                console.error(
                  'Failed to delete room, something went wrong:',
                  err
                );
              });
          } else {
            console.log('Did not delete room, room not empty!');
          }
        }, delay);
      }
      console.log(`Client ${socket.id} disconnected`);
    });
  });
};
