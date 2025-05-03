
import { ChessType } from 'constants/enum';
import GameModel, { IGame } from 'models/Game';
import { ROOM_STATUS } from 'models/Room';
import moment from 'moment';
const timePerPlayer = {
    styleMin: 15,
    time: 4500,
    isExtra: false
}

export const boardGameInit = [
    [
        { name: 'XC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Xa, position: { row: 0, col: 0 } },
        { name: 'KC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Ki, position: { row: 0, col: 1 } },
        { name: 'SC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Si, position: { row: 0, col: 2 } },
        { name: 'TC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Tuong, position: { row: 0, col: 3 } },
        { name: 'VC', team: [], teamType: 'C', isRotate: false, isTeam: false, type: ChessType.Vuong, position: { row: 0, col: 4 } },
        { name: 'TC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Tuong, position: { row: 0, col: 5 } },
        { name: 'SC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Si, position: { row: 0, col: 6 } },
        { name: 'KC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Ki, position: { row: 0, col: 7 } },
        { name: 'XC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Xa, position: { row: 0, col: 8 } }
    ],
    [null, null, null, null, null, null, null, null, null],
    [
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 0 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 1 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 2 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 3 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 4 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 5 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 6 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 7 } },
        { name: 'BC', team: [], teamType: 'C', isRotate: true, isTeam: true, rotate: 0, type: ChessType.Binh, position: { row: 2, col: 8 } }
    ],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 0 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 1 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 2 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 3 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 4 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 5 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 6 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 7 } },
        { name: 'BX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Binh, position: { row: 6, col: 8 } },
    ],
    [null, null, null, null, null, null, null, null, null],
    [
        { name: 'XX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Xa, position: { row: 8, col: 0 } },
        { name: 'KX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Ki, position: { row: 8, col: 1 } },
        { name: 'SX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Si, position: { row: 8, col: 2 } },
        { name: 'TX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Tuong, position: { row: 8, col: 3 } },
        { name: 'VX', team: [], teamType: 'X', isRotate: false, isTeam: true, rotate: 0, type: ChessType.Vuong, position: { row: 8, col: 4 } },
        { name: 'TX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Tuong, position: { row: 8, col: 5 } },
        { name: 'SX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Si, position: { row: 8, col: 6 } },
        { name: 'KX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Ki, position: { row: 8, col: 7 } },
        { name: 'XX', team: [], teamType: 'X', isRotate: true, isTeam: true, rotate: 180, type: ChessType.Xa, position: { row: 8, col: 8 } }
    ]
]
export const orangePrisonInit = [
    { name: 'LC', team: [], teamType: 'C', isRotate: false, rotate: 180, type: ChessType.Long, quantity: 1, position: { row: -1, col: -1 } },
    { name: 'PC', team: [], teamType: 'C', isRotate: false, rotate: 180, type: ChessType.Phuong, quantity: 1, position: { row: -1, col: -1 } },
    { name: 'BC', team: [], teamType: 'C', isRotate: true, rotate: 180, type: ChessType.Binh, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'TC', team: [], teamType: 'C', isRotate: true, rotate: 180, type: ChessType.Tuong, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'SC', team: [], teamType: 'C', isRotate: true, rotate: 180, type: ChessType.Si, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'XC', team: [], teamType: 'C', isRotate: true, rotate: 180, type: ChessType.Xa, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'KC', team: [], teamType: 'C', isRotate: true, rotate: 180, type: ChessType.Ki, quantity: 0, position: { row: -1, col: -1 } },
]
export const greenPrisonInit = [
    { name: 'LX', team: [], teamType: 'X', isRotate: false, type: ChessType.Long, quantity: 1, position: { row: -1, col: -1 } },
    { name: 'PX', team: [], teamType: 'X', isRotate: false, type: ChessType.Phuong, quantity: 1, position: { row: -1, col: -1 } },
    { name: 'BX', team: [], teamType: 'X', isRotate: true, rotate: 180, type: ChessType.Binh, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'TX', team: [], teamType: 'X', isRotate: true, rotate: 180, type: ChessType.Tuong, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'SX', team: [], teamType: 'X', isRotate: true, rotate: 180, type: ChessType.Si, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'XX', team: [], teamType: 'X', isRotate: true, rotate: 180, type: ChessType.Xa, quantity: 0, position: { row: -1, col: -1 } },
    { name: 'KX', team: [], teamType: 'X', isRotate: true, rotate: 180, type: ChessType.Ki, quantity: 0, position: { row: -1, col: -1 } },
]
export const timers = [
    timePerPlayer,
    timePerPlayer
]
export class GameService {
    constructor() {
    }
    async createGame(timers: any): Promise<IGame> {
        const gameModel = new GameModel({
            board: boardGameInit,
            orangePrison: orangePrisonInit,
            greenPrison: greenPrisonInit,
            timers,
            historyTemp: {}
        });
        return gameModel.save();
    }
    async findGameById(id: string): Promise<IGame | null> {
        return GameModel.findByIdAndUpdate(id).lean();
    }
    async updateGameById(id: string, data: Partial<IGame>, gameData: IGame | null, isCalculateTime: boolean): Promise<IGame | null> {
        if (gameData && gameData.isStart) {
            let currentTime = moment.utc(new Date());
            let lastestTime = moment.utc(gameData.updatedAt);
            const timePlay = moment.duration(currentTime.diff(lastestTime)).asSeconds();
            const isTimeCalculateGreen = gameData.turn === 'X' && gameData.status === 'setup' && gameData.greenPrison.filter(prison => prison.quantity === 1).length === 0;
            const isTimeCalculateOrange = gameData.turn === 'C' && gameData.status === 'setup' && gameData.orangePrison.filter(prison => prison.quantity === 1).length === 0;
            if (((data.turn === 'C' || !data.turn) && gameData.turn === 'X' && gameData.status === 'play') || isTimeCalculateGreen) { // check update  turn
                let { style, time } = gameData.timers[1];
                let timeRemaining = time - timePlay;
                if (timeRemaining <= 60 && timeRemaining >= 0 && isCalculateTime) {
                    gameData.timers[1].time = 60;
                } else if (timeRemaining <= 0) {
                    while (timeRemaining < 0) {
                        gameData.timers[1].byoyomi -= 1;
                        timeRemaining = timeRemaining + style;
                    }
                    gameData.timers[1].time = timeRemaining
                }
                else {
                    gameData.timers[1].time -= timePlay;
                }
            }
            if (((data.turn === 'X' || !data.turn) && gameData.turn === 'C' && gameData.status === 'play') || isTimeCalculateOrange) {// check update  turn
                let { style, time } = gameData.timers[0];
                let timeRemaining = time - timePlay;
                if (timeRemaining <= 60 && timeRemaining >= 0 && isCalculateTime) {
                    gameData.timers[0].time = 60;
                } else if (timeRemaining <= 0) {
                    while (timeRemaining < 0) {
                        gameData.timers[0].byoyomi -= 1;
                        timeRemaining = timeRemaining + style;
                    }
                    gameData.timers[0].time = timeRemaining
                }
                else {
                    gameData.timers[0].time -= timePlay;
                }
            }
        }
        gameData?.timers.forEach(item => item.time < 0 ? item.time = 0 : item);
        return GameModel.findByIdAndUpdate(id, { ...data, timers: gameData?.timers }, { new: true });
    }
}