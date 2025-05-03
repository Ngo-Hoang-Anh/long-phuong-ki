import { Server, Socket } from 'socket.io';
import { socketLobby } from './LobbyChat';
import socketValidateMsg from 'middlewares/socket_middlewares/SocketValidateMsg';
import { socketRoom } from './WaitingRoom';
import { socketUser } from './User';
import { socketGame } from './Game';
import { socketGameChat } from './GameChat';

export const setupSocketIo = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socketValidateMsg(socket);
        socketUser(socket, io);
        socketLobby(socket, io);
        socketRoom(socket, io);
        socketGame(socket, io);
        socketGameChat(socket, io);
    });
};