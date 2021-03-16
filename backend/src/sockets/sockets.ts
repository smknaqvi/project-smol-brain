//https://stackoverflow.com/a/38132147
import { Server } from 'socket.io';

export const ioFunction = (io: Server) => {
  io.on('connection', (socket: any) => {
    console.log(`Client ${socket.id} connected`);
    //https://stackoverflow.com/a/26323687
    const partyID: string = socket.request._query['partyID'];
    //create new room and redirect, but check permissions
    socket.join(partyID);
    io.sockets.in(partyID).emit('message', 'New User Connected');
    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} diconnected`);
    });
  });
};
