
import RoomMessageModel, { IRoomMessage } from 'models/RoomMessage';


export class RoomMessageService {
    async createMessage({ roomId, userId, message }: any) {
        let roomMessageModel = new RoomMessageModel({ roomId, userId, message });
        return (await roomMessageModel.save()).populate({ path: 'userId', select: 'name' });
    }
    async getListMessageByRoomId(roomId: string) {
        return await RoomMessageModel.find({ roomId }).populate({ path: 'userId', select: 'name' });
    }
}