import { Server, Socket } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import sharedSession from 'express-socket.io-session';
import { RequestHandler } from 'express';
import redisClient, { get, exists, set, del } from '../lib/redis';
import { once } from 'lodash';
import { verifyPassword } from '../lib/crypto';
import { INTERNAL_ERROR_MESSAGE } from '../constants';

export const createSocketServerOnce = once((server, corsOptions, session) => {
  const io = new Server(server, { cors: corsOptions });
  ioFunction(io, session);
  const pubClient = redisClient.duplicate();
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter({ pubClient, subClient }));
  return io;
});

const ioFunction = (io: Server, session: RequestHandler): void => {
  io.use(sharedSession(session));

  io.use((socket, next) => {
    const partyID = socket.handshake.query.partyID as string;
    const password = socket.handshake.auth.password as string;

    exists(partyID)
      .then((roomExists) => {
        if (!roomExists || !(socket.handshake as any).session.username) {
          const err = new Error('invalid partyID');
          return next(err);
        }
      })
      .catch((err) => {
        return next(err);
      });

    get(partyID, 'password')
      .then((roomPassword) => {
        if (roomPassword) {
          verifyPassword(password, roomPassword as string).then(
            (isValidPassword) => {
              if (isValidPassword) {
                return next();
              } else {
                const err = new Error('invalid room password');
                return next(err);
              }
            }
          );
        } else {
          return next();
        }
      })
      .catch((err) => {
        return next(err);
      });
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client ${socket.id} connected`);
    const partyID = socket.handshake.query.partyID as string;

    get(partyID, 'current_url')
      .then((url) => {
        if (url) {
          io.to(socket.id).emit('url', url);
        }
      })
      .catch((err) => {
        io.to(socket.id).emit('error', INTERNAL_ERROR_MESSAGE);
      });

    //create new room and redirect, but check permissions
    socket.join(partyID);
    io.sockets.to(partyID).emit('new-connection', socket.id);

    socket.on('play', (timestamp: number) => {
      io.sockets.in(partyID).emit('play', timestamp);
    });

    socket.on('pause', (timestamp: number) => {
      io.sockets.in(partyID).emit('pause', timestamp);
    });

    socket.on('url', (url: string) => {
      set(partyID, 'current_url', url)
        .then(() => {
          io.sockets.in(partyID).emit('url', encodeURI(url));
        })
        .catch((err) => {
          io.to(socket.id).emit('error', INTERNAL_ERROR_MESSAGE);
        });
    });

    socket.on('disconnect', () => {
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
