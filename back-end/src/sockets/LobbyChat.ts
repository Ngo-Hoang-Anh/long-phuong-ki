import { LOBBY_CHAT_RECEIVE, LOBBY_CHAT_SEND } from "../constants";
import { Socket, Server } from "socket.io";

export const socketLobby = (socket: Socket, io: Server) => {
    socket.on(LOBBY_CHAT_SEND, (data: any) => {
        const { name, _id } = socket.data.user;
        console.log(`${name} chat with msg: ${data.msg}`)
        io.emit(LOBBY_CHAT_RECEIVE, { _id, userName: name, msg: data.msg, time: Date.now().valueOf() })
    })

}