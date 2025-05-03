import { isObjectId } from 'common/utility/helper';
import { NextFunction, Request, Response } from 'express';
import { RoomMessageService } from 'services/RoomMessageService';
import { RoomService } from 'services/RoomServices';
import { UserService } from 'services/UserServices';

export const getAllRoomController = async (req: Request, res: Response, next: NextFunction) => {
    let roomService = new RoomService();
    try {
        let allRoom = await roomService.getAllRoom();
        return res.status(200).json({ error: false, data: allRoom })
    } catch (err) {
        console.log(err);
        next(err);
    }
}
export const postCreateRoomController = async (req: Request, res: Response, next: NextFunction) => {
    let ownerId = req.user?._id;
    const { color, time, roomName } = req.body;
    let roomService = new RoomService();
    try {
        if (!ownerId) throw "Something wrong";
        let allRoom = await roomService.createRoom({ roomName, ownerId, color, time });
        return res.status(200).json({ error: false, data: allRoom })
    } catch (err) {
        console.log(err);
        next(err)
    }
}
export const getWaitingRoomController = async (req: Request, res: Response, next: NextFunction) => {
    let roomService = new RoomService();
    try {
        let allRoom = await roomService.getWaitingRoom();
        return res.status(200).json({ error: false, data: allRoom })
    } catch (err) {
        console.log(err);
        next(err);
    }
}
export const getPlayingRoomController = async (req: Request, res: Response, next: NextFunction) => {
    let roomService = new RoomService();
    try {
        let allRoom = await roomService.getPlayingRoom();
        return res.status(200).json({ error: false, data: allRoom })
    } catch (err) {
        console.log(err);
        next(err);
    }
}
export const getDetailRoomController = async (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;
    if (!isObjectId(roomId)) {
        return res.status(400).json({ error: true, msg: "Phòng không tồn tại" })
    }
    let roomService = new RoomService();
    let roomMessageService = new RoomMessageService();
    try {
        let room = await roomService.getRoomById(roomId);
        let message = await roomMessageService.getListMessageByRoomId(roomId);
        return res.status(200).json({ error: false, data: { room, listMessages: message } })
    } catch (err) {
        console.log(err);
        next(err);
    }
}