import { Server, Socket } from 'socket.io';

export const ioFunction = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client ${socket.id} connected`);

    const partyID = socket.handshake.query['partyID'] as string;
    //create new room and redirect, but check permissions
    socket.join(partyID);

    io.sockets.in(partyID).emit('new-connection', 'New User Connected');

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
      io.sockets.in(partyID).emit('url', url);
    });

    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} disconnected`);
    });
  });
};
