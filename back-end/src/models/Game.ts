import { ChessType } from '../constants';
import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IChessType {
    name: string;
    team: [];
    teamType: 'C' | 'X';
    isRotate: boolean;
    rotate: number;
    type: string;
    position: { row: number, col: number };
}
export interface IPrisonChessType extends IChessType {
    quantity: number
}
// export interface IChessPiece
export type TTurn = 'C' | 'X';
export type TGameStatus = 'setup' | 'play';
export interface IGame extends Document {
    board: Array<Array<any>>;
    turn: TTurn;
    history: Array<string>;
    win: Types.ObjectId | null;
    timers: Array<any>;
    isStart: boolean;
    orangePrison: Array<IPrisonChessType>;
    greenPrison: Array<IPrisonChessType>;
    status: TGameStatus;
    isMoved: boolean;
    isDrop: boolean;
    historyTemp: any;
    createdAt: Date;
    updatedAt: Date;
}

const GameSchema = new Schema<IGame>({
    board: [{
        type: Array<Array<IChessType | null>>,
        required: true
    }],
    greenPrison: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    orangePrison: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    turn: {
        type: String,
        required: true,
        default: 'C'
    },
    history: [{
        type: String,
        default: []
    }],
    win: {
        type: Types.ObjectId,
        default: null
    },
    timers: [{
        type: Object
    }],
    isStart: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'setup'
    },
    isMoved: {
        type: Boolean,
        default: false
    },
    isDrop: {
        type: Boolean,
        default: false
    },
    historyTemp: {
        type: Object,
        default: null
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
}, { versionKey: false, timestamps: true });

export default mongoose.model<IGame>('Game', GameSchema);