import { UserService } from "services/UserServices";
import { USER_ONLINE, USER_OFFLINE } from "../constants";
import { Socket, Server } from "socket.io";

export const socketUser = async (socket: Socket, io: Server) => {
    console.log(`User ${socket.data.user?.name} connected`)
    const userService = new UserService();
    let dataOnl = await userService.updateUserOnline(socket.data.user._id, true);
    io.emit(USER_ONLINE, { data: dataOnl });
    socket.on('disconnect', async (reason) => {
        console.log(`user ${socket.data.user?._id} disconnect by`, reason)
        let dataOff = await userService.updateUserOnline(socket.data.user._id, false);
        io.emit(USER_OFFLINE, { data: dataOff });
    })

}