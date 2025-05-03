import mongoose, { Schema, Document, Types } from 'mongoose';

export type ROOM_STATUS = "waiting" | "playing" | "done";
export type TWIN = "C" | "X" | null;

export interface IRoom extends Document {
    participants: Types.ObjectId[];
    status: ROOM_STATUS;
    name: string;
    gameId: Types.ObjectId | null;
    win: TWIN;
    ownerId: Types.ObjectId;
    password: string;
    isDeleted: boolean;
}

const RoomSchema = new Schema<IRoom>({
    participants: [{ type: Types.ObjectId, ref: 'User' }],
    status: {
        type: String,
        required: true,
        default: 'waiting'
    },
    name: {
        type: String,
        required: true
    },
    gameId: { type: Types.ObjectId, ref: 'Game' },
    win: {
        type: String,
        default: null
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    password: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { versionKey: false, timestamps: true });

export default mongoose.model<IRoom>('Room', RoomSchema);