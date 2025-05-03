import RoomModel, { IRoom } from 'models/Room';
import { FlattenMaps, Model } from 'mongoose';
import { GameService } from './GameServices';
import moment from 'moment';
import { IGame } from 'models/Game';

export class RoomService {
    constructor() {
    }
    async createRoom({ name, ownerId, color, timers, password }: any): Promise<IRoom> {
        const gameService = new GameService();
        const resGame = await gameService.createGame(timers);
        let participants = [];
        if (color === 'C') {
            participants[0] = ownerId;
            participants[1] = null;
        } else {
            participants[0] = null;
            participants[1] = ownerId;
        }
        let res = new RoomModel({ name, participants: participants, gameId: resGame._id, ownerId, password });
        return res.save();
    }
    async getAllRoom(): Promise<IRoom[]> {
        let model = await RoomModel.find();
        return model;
    }
    async getRoomById(id: string): Promise<FlattenMaps<Omit<IRoom, "gameId">> | null> {
        let model = await RoomModel.findOne({ _id: id, isDeleted: false }).populate({
            path: 'participants', select: 'name email', options: {
                retainNullValues: true
            }
        }).populate<{ gameId: IGame }>('gameId').lean();
        if (model && model.gameId.isStart) {
            let currentTime = moment.utc(new Date());
            let lastestTime = moment.utc(model.gameId.updatedAt);
            const timePlay = Math.floor(moment.duration(currentTime.diff(lastestTime)).asSeconds());
            const isTimeCalculateGreen = model.gameId.turn === 'X' && model.gameId.status === 'setup' && model.gameId.greenPrison.filter(prison => prison.quantity === 1).length === 1;
            const isTimeCalculateOrange = model.gameId.turn === 'C' && model.gameId.status === 'setup' && model.gameId.orangePrison.filter(prison => prison.quantity === 1).length === 1;
            if ((model.gameId.turn === 'C' && model.gameId.status === 'play') || isTimeCalculateOrange) {
                let { byoyomi, time, style } = model.gameId.timers[0];
                let timeRemaining = time - timePlay;
                let totalTimePlay = (style) * byoyomi + time;
                if (timePlay > totalTimePlay) {
                    return this.updateWinById(model._id, 'X')
                }
                if (timeRemaining < 0) {
                    do {
                        model.gameId.timers[0].byoyomi -= 1;
                        timeRemaining = timeRemaining + style;
                    } while (timeRemaining < 0);
                    model.gameId.timers[0].time = timeRemaining;
                } else {
                    model.gameId.timers[0].time = timeRemaining;
                }
            }
            if ((model.gameId.turn === 'X' && model.gameId.status === 'play') || isTimeCalculateGreen) {
                let { byoyomi, time, style } = model.gameId.timers[1];
                let totalTimePlay = (style) * byoyomi + time;
                let timeRemaining = time - timePlay;
                if (timePlay > totalTimePlay) {
                    return this.updateWinById(model._id, 'C')
                }
                if (timeRemaining < 0) {
                    do {
                        model.gameId.timers[1].byoyomi -= 1;
                        timeRemaining = timeRemaining + style;
                    } while (timeRemaining < 0);
                    model.gameId.timers[1].time = timeRemaining;
                } else {
                    model.gameId.timers[1].time = timeRemaining;
                }
            }
        }
        return model;
    }
    async getRoomByIdNotPopulate(id: string): Promise<IRoom | null> {
        let model = await RoomModel.findById(id).lean();
        return model;
    }
    async getRoomByOwnerIdNotPopulate(roomId: string, ownerId: string, isAdmin: boolean): Promise<IRoom | null> {
        if (isAdmin) {
            return await RoomModel.findOne({ _id: roomId }).lean();
        } else {
            return await RoomModel.findOne({ ownerId: ownerId, _id: roomId }).lean();
        }
    }
    async joinRoomById(id: string, idParticipant: string): Promise<IRoom | null> {
        let model = await RoomModel.findByIdAndUpdate(id, {
            $set: { 'participants.$[i]': idParticipant },
        }, { new: true, arrayFilters: [{ i: { $eq: null } }] }).populate('participants', 'name email').populate('gameId').lean();
        return model;
    }
    async updateWinById(id: string, teamWin: string) {
        let model = await RoomModel.findByIdAndUpdate(id, { status: 'done', win: teamWin }, { new: true }).populate('participants', 'name email').populate('gameId').lean();
        return model;
    }
    async updateRoomById(id: string, data: any): Promise<IRoom | null> {
        let model = await RoomModel.findByIdAndUpdate(id, data, { new: true }).populate('participants', 'name email').populate('gameId').lean();
        return model;
    }
    async updateRoomByIdNotPopulate(id: string, data: any): Promise<IRoom | null> {
        let model = await RoomModel.findByIdAndUpdate(id, data, { new: true }).lean();
        return model;
    }
    async getWaitingRoom(): Promise<IRoom[]> {
        let model = await RoomModel.find({ status: 'waiting', isDeleted: { $eq: false } });
        return model;
    }
    async getPlayingRoom(): Promise<IRoom[]> {
        let model = await RoomModel.find({ status: 'playing', isDeleted: { $eq: false } });
        return model;
    }
    async getWaitingRoomByOwnerId(ownerId: string): Promise<IRoom | null> {
        let model = await RoomModel.findOne(
            {
                $or: [{ status: 'waiting' }, { status: 'playing' }],
                ownerId,
                isDeleted: false
            });
        return model;
    }
    async getAllRoomByUserId(userId: string): Promise<IRoom[] | []> {
        let model = await RoomModel.find({
            participants: { $in: [userId] },
            status: { $eq: 'done' },
            createdAt: { $gte: new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000))) },
            isDeleted: false
        })
            .select("-password")
            .sort({ createdAt: -1 })
            .populate({ path: 'gameId', select: 'history' })
            .populate({ path: "participants", select: "name" });
        return model;
    }
}