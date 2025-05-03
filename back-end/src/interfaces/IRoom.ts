

type typeEvent = 'create' | 'update';

export interface IMsgRoom {
    type: typeEvent;
    roomName: string;
    _id: string;
    participants: Array<string>;
    color: string;
    timers: any;
    roomId: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}