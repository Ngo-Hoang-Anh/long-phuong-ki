import { NextFunction, Request, Response } from 'express';
import { RoomService } from 'services/RoomServices';
import { UserService } from 'services/UserServices';

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user) {
            const userService = new UserService();
            let dataUser = await userService.getUserById(req.user._id);
            return res.status(200).json({
                error: false, data: dataUser
            });
        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}
export const getHistoryUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        if (userId) {
            const roomService = new RoomService();
            const userService = new UserService();
            let histories = await roomService.getAllRoomByUserId(userId);
            let playerInfo = await userService.getUserById(userId)
            return res.status(200).json({
                error: false, data: { histories, playerInfo }
            });
        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}

export const getUserOnlineController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userService = new UserService();
        let dataUser = await userService.getUserOnline();
        return res.status(200).json({
            error: false, data: dataUser
        });
    } catch (err) {
        console.log(err);
        next(err)
    }
}