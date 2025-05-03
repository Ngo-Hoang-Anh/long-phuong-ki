import { RoomMessageService } from "services/RoomMessageService";
import { ROOM_MESSAGE_RECEIVE, ROOM_MESSAGE_SEND } from "../constants/SocketEventName";
import { Server, Socket } from "socket.io";

export const socketGameChat = (socket: Socket, io: Server) => {
    socket.on(ROOM_MESSAGE_SEND, async (data) => {
        const { msg, userId, roomId } = data;
        const { name, _id } = socket.data.user;
        console.log(`${name} chat in room id ${roomId}`, data.msg)
        try {
            let roomMessageService = new RoomMessageService();
            let msgData = await roomMessageService.createMessage({ roomId, message: msg, userId: _id })
            io.sockets.to(roomId).emit(ROOM_MESSAGE_RECEIVE, msgData)
        } catch (error) {
            console.log(error);
        }
    })
}