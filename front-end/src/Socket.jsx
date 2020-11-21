import * as SocketIO from 'socket.io-client';

const Socket = SocketIO.connect("localhost:8080");
export default Socket;
