import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRoomMessage extends Document {
    userId: Types.ObjectId;
    roomId: Types.ObjectId;
    message: string;
}

const RoomMessageSchema = new Schema<IRoomMessage>({
    userId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    roomId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Room'
    },
    message: {
        type: String,
        required: true
    }
}, { versionKey: false, timestamps: true });

export default mongoose.model<IRoomMessage>('RoomMessage', RoomMessageSchema);