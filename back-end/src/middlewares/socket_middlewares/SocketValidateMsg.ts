import { Socket } from "socket.io";
import { LOBBY_CHAT_SEND } from '../../constants/SocketEventName';

const socketValidateMsg = (socket: Socket) => {
    socket.use((packet, next) => {
        // 'packet' contains the message data sent by the client
        const [eventName, data] = packet;
        try {
            if (eventName === LOBBY_CHAT_SEND) {
                if (data.msg && typeof data.msg === 'string') {
                    next();
                } else {
                    next(new Error('Invalid message format'));
                }
            } else {
                next();
            }
        } catch (err) {
            console.log(err)
            next(new Error('Invalid message format'));
        }
    });
}
export default socketValidateMsg;