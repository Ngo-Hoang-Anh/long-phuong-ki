
import { IMsgRoom } from "interfaces/IRoom";
import { ROOM_RECEIVE, ROOM_SEND, RoomType, SOCKET_ERROR } from "../constants";
import { Socket, Server } from "socket.io";
import { RoomService } from "services/RoomServices";
import { UserService } from "services/UserServices";

export const socketRoom = (socket: Socket, io: Server) => {
    socket.on(ROOM_SEND, async (data: IMsgRoom) => {
        try {
            const { name, _id } = socket.data.user;
            const { roomName, type, color, timers, password } = data;
            if (!roomName && !type && !color && !timers) return;
            if (type === RoomType['CREATE']) {
                const roomService = new RoomService();
                const isExistsRoom = await roomService.getWaitingRoomByOwnerId(_id);
                if (!isExistsRoom) {
                    const room = await roomService.createRoom({ name: roomName, ownerId: _id, color, timers: [timers, timers], password });
                    console.log(`${name} ${type} with name: ${roomName}`);
                    io.emit(ROOM_RECEIVE, { data: room, type: RoomType['CREATE'] })
                } else {
                    console.log(`${name} đã chơi ở 1 phòng khác`);
                    socket.emit(SOCKET_ERROR, { msg: 'Bạn đang chơi ở phòng khác' })
                }
            }
            if (type === RoomType['DELETE']) {
                const roomService = new RoomService();
                const userService = new UserService();
                let userData = await userService.getUserById(_id);
                const roomData = await roomService.getRoomByOwnerIdNotPopulate(data.roomId, _id, !!userData?.isAdmin);
                if (roomData) {
                    await roomService.updateRoomByIdNotPopulate(roomData._id, { isDeleted: true });
                    io.emit(ROOM_RECEIVE, { data: { roomId: roomData._id }, type: RoomType['DELETE'] })
                } else {
                    console.log(`Không phải phòng của ${name}`);
                    socket.emit(SOCKET_ERROR, { msg: 'Không phải phòng của bạn' })
                }
            }
        } catch (error) {
            console.log(error);
            socket.emit(SOCKET_ERROR, { msg: 'Lỗi tạo phòng' })
        }
    })

}