import { GameService } from "services/GameServices";
import {
  JOIN_GAME_RECEIVE,
  JOIN_GAME_SEND,
  JOIN_ROOM,
  ROOM_MOVE_RECEIVE,
  ROOM_MOVE_SEND,
  ROOM_RECEIVE,
} from "constants/SocketEventName";
import { Server, Socket } from "socket.io";
import { RoomService } from "services/RoomServices";
import { JoinGameType, RoomType } from "constants/Varibles";
import { ChessType } from "constants/enum";
import moment from "moment";
import { funcCheckRotate, parseColRowToCharactor } from "common/utility/helper";

export const socketGame = (socket: Socket, io: Server) => {
  socket.on(JOIN_ROOM, (data) => {
    if (!data.roomId) return;
    const { name, _id } = socket.data.user;
    console.log(`${name} join room ${data.roomId}`);
    socket.join(data.roomId);
  });
  socket.on(ROOM_MOVE_SEND, async (data) => {
    let {
      gameId,
      position,
      roomId,
      objChest,
      type,
      direction,
      isMoveTeam,
      isSameType,
    } = data;
    const { _id } = socket.data.user;
    let roomService = new RoomService();
    let roomDetail = await roomService.getRoomByIdNotPopulate(roomId);
    let gameService = new GameService();
    let gameData = await gameService.findGameById(gameId);
    if (!roomDetail?.participants.map((i) => i.toString()).includes(_id)) {
      console.warn(`User ${_id} not permission to move chess`);
      return;
    }
    if (gameData) {
      if (
        (roomDetail?.participants[0].toString() === _id &&
          gameData.turn === "X") ||
        (roomDetail?.participants[1].toString() === _id &&
          gameData.turn === "C")
      ) {
        return console.warn(
          `User ${_id} not your turn to move chess, turn of ${gameData.turn}`
        );
      }
      const { board } = gameData;
      let objUpdate: any = {};
      switch (type) {
        case "move": {
          const { startRow, startCol, endRow, endCol } = position;
          const curPiece = objChest;
          const piece = board[endRow][endCol];
          objUpdate.history = [
            ...gameData.history,
            `${
              isMoveTeam && curPiece.team.length > 0
                ? `[${objChest.type}]`
                : objChest.type
            }${parseColRowToCharactor(endCol, endRow)}`,
          ];
          objUpdate.historyTemp = {
            start: { row: startRow, col: startCol },
            end: { row: endRow, col: endCol },
            isJustGone:
              endRow === gameData.historyTemp?.end?.row &&
              endCol === gameData.historyTemp?.end?.col,
            isSameType:
              isSameType ||
              (curPiece.isTeam &&
                piece?.type === curPiece.type &&
                piece?.teamType === curPiece.teamType),
            isCreateTeam: isMoveTeam && curPiece.team.length > 0,
          };
          if (curPiece.teamType === piece?.teamType) {
            if (piece.team.length) {
              piece.team.forEach((child: any) => curPiece.team.push(child));
              piece.team = [];
              curPiece.team.unshift({ ...piece, team: [] });
            } else {
              curPiece.team.push(piece);
            }
            isMoveTeam = true;
          }
          if (piece && curPiece.teamType !== piece?.teamType) {
            //bắt quân
            if (gameData.turn === "C") {
              objUpdate.orangePrison = gameData.orangePrison.map((item) => {
                if (item?.type === piece.type) {
                  return {
                    ...item,
                    quantity: item.quantity + 1,
                  };
                }
                return item;
              });
              if (board[endRow][endCol].team?.length > 0) {
                objUpdate.orangePrison.forEach((item: any) => {
                  board[endRow][endCol].team.forEach((prison: any) => {
                    if (prison.type === item.type) {
                      item.quantity += 1;
                    }
                  });
                });
              }
            } else {
              objUpdate.greenPrison = gameData.greenPrison.map((item) =>
                item?.type === piece.type
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
              if (board[endRow][endCol].team?.length > 0) {
                objUpdate.greenPrison.forEach((item: any) => {
                  board[endRow][endCol].team.forEach((prison: any) => {
                    if (prison.type === item.type) {
                      item.quantity += 1;
                    }
                  });
                });
              }
            }
          }
          if (!isMoveTeam) {
            curPiece.position.row = endRow;
            curPiece.position.col = endCol;
            if (curPiece.team.length > 0) {
              curPiece.team.forEach((item: any) => {
                item.position.row = startRow;
                item.position.col = startCol;
              });
              board[startRow][startCol] = {
                ...curPiece.team[0],
                team: curPiece.team.slice(1),
              };
              board[endRow][endCol] = { ...curPiece, team: [] };
            } else {
              board[startRow][startCol] = { ...curPiece.team[0], team: [] };
              board[endRow][endCol] = { ...curPiece, team: [] };
            }
          } else {
            curPiece.position.row = endRow;
            curPiece.position.col = endCol;
            board[endRow][endCol] = curPiece;
            board[startRow][startCol] = null;
            objUpdate.historyTemp.isMoveTeam = true;
          }
          if (
            curPiece.type === ChessType.Vuong ||
            curPiece.type === ChessType.Long ||
            curPiece.type === ChessType.Phuong
          ) {
            let teamOrOne = objUpdate.historyTemp.isCreateTeam
              ? `[${curPiece.type}]`
              : curPiece.type;
            let history = `${teamOrOne}${parseColRowToCharactor(
              endCol,
              endRow
            )}`;
            if (objUpdate.historyTemp.isJustGone) {
              // check quân đi vào cùng ô mà đối phương vừa đi vào
              history = `${teamOrOne}=`;
            }
            if (objUpdate.historyTemp.isSameType) {
              // check cùng quân đi lên nhau cho VUONG LONG PHUONG
              history += `.${parseColRowToCharactor(startCol, startRow)}`;
            }
            delete objUpdate.historyTemp?.isMoveTeam; // delete before update
            delete objUpdate.historyTemp?.isCreateTeam;
            delete objUpdate.historyTemp?.rotate;
            delete objUpdate.historyTemp?.isJustGone;
            delete objUpdate.historyTemp?.isSameType;
            let dataRes = await gameService.updateGameById(
              gameData._id,
              {
                ...objUpdate,
                board,
                turn: gameData.turn === "C" ? "X" : "C",
                isMoved: false,
                isDrop: false,
                history: [...gameData.history, history],
              },
              gameData,
              true
            );
            io.sockets.to(roomId).emit(ROOM_MOVE_RECEIVE, {
              isPlaySound: true,
              type: "done",
              position,
              game: dataRes,
            });
          } else {
            let dataRes = await gameService.updateGameById(
              gameData._id,
              {
                ...objUpdate,
                board,
                isMoved: true,
                isDrop: false,
                history: gameData.history,
              },
              gameData,
              false
            );
            io.sockets.to(roomId).emit(ROOM_MOVE_RECEIVE, {
              isPlaySound: true,
              type: "move",
              position,
              game: dataRes,
            });
          }
          break;
        }
        case "rotate": {
          if (direction === "left") {
            board[objChest.position.row][objChest.position.col].rotate -= 90;
          } else {
            board[objChest.position.row][objChest.position.col].rotate += 90;
          }
          let isCalculateTime = false;
          let charRotate = funcCheckRotate(
            board[objChest.position.row][objChest.position.col].rotate
          );
          let curChar = parseColRowToCharactor(
            objChest.position.col,
            objChest.position.row
          );
          let teamOrOne = gameData.historyTemp.isCreateTeam
            ? `[${objChest.type}]`
            : objChest.type;
          let history = `${teamOrOne}${curChar}${charRotate}`;
          let objUpdate: any = {};
          if (gameData.isDrop) {
            objUpdate.isMoved = true;
            objUpdate.historyTemp = { ...gameData.historyTemp, rotate: true };
            isCalculateTime = false;
          } else {
            if (gameData.historyTemp.isJustGone) {
              history = `${teamOrOne}=${charRotate}`;
            }
            if (!gameData.isMoved) {
              objUpdate.historyTemp = {
                end: { col: objChest.position.col, row: objChest.position.row },
              };
              if (isSameType) {
                history += `.${parseColRowToCharactor(
                  objChest.position.col,
                  objChest.position.row
                )}`;
              }
            } else {
              if (gameData.historyTemp.isSameType) {
                history += `.${parseColRowToCharactor(
                  gameData.historyTemp.start.col,
                  gameData.historyTemp.start.row
                )}`;
              }
            }
            objUpdate.turn = gameData.turn === "C" ? "X" : "C";
            objUpdate.isMoved = false;
            objUpdate.isDrop = false;
            objUpdate.history = [...gameData.history, history];
            isCalculateTime = true;
          }
          let dataRes = await gameService.updateGameById(
            gameData._id,
            {
              board,
              ...objUpdate,
            },
            gameData,
            isCalculateTime
          );
          io.sockets
            .to(roomId)
            .emit(ROOM_MOVE_RECEIVE, { game: dataRes, type: "rotate" });
          break;
        }
        case "done": {
          const { row, col } = gameData.historyTemp.end;
          let objChest = board[row][col];
          let teamOrOne = gameData.historyTemp.isCreateTeam
            ? `[${objChest.type}]`
            : objChest.type;
          let curChar = parseColRowToCharactor(
            objChest.position.col,
            objChest.position.row
          );
          let charRotate = gameData.historyTemp.rotate
            ? funcCheckRotate(
                board[objChest.position.row][objChest.position.col].rotate
              )
            : "";
          let history = gameData.isDrop
            ? `${teamOrOne}*${parseColRowToCharactor(
                col,
                row
              )}${funcCheckRotate(
                board[objChest.position.row][objChest.position.col].rotate
              )}`
            : `${teamOrOne}${curChar}${charRotate}`;
          if (gameData.historyTemp.isJustGone) {
            history = `${teamOrOne}=${charRotate}`;
          }
          if (gameData.historyTemp.isSameType && !gameData.isDrop) {
            history += `.${parseColRowToCharactor(
              gameData.historyTemp.start.col,
              gameData.historyTemp.start.row
            )}`;
          }
          delete gameData.historyTemp?.isCreateTeam;
          delete gameData.historyTemp?.rotate;
          delete gameData.historyTemp?.isJustGone;
          delete gameData.historyTemp?.isSameType;
          let dataRes = await gameService.updateGameById(
            gameData._id,
            {
              turn: gameData.turn === "C" ? "X" : "C",
              isMoved: false,
              isDrop: false,
              historyTemp: gameData.historyTemp,
              history: [...gameData.history, history],
            },
            gameData,
            true
          );
          io.sockets
            .to(roomId)
            .emit(ROOM_MOVE_RECEIVE, { game: dataRes, type: "done" });
          break;
        }
        case "surrender": {
          console.log(`Player ${_id} surrender`);
          if (roomDetail) {
            if (
              !roomDetail.participants
                .map((item) => item.toString())
                .includes(_id)
            )
              return console.log(`${_id} not in game.`);
            let dataRes = await gameService.updateGameById(
              gameId,
              { isStart: false },
              gameData,
              true
            );
            const roomUpdated = await roomService.updateWinById(
              roomDetail._id,
              roomDetail.participants[0].toString() === _id ? "X" : "C"
            );
            io.sockets.to(roomId).emit(ROOM_MOVE_RECEIVE, {
              board,
              type: "end_game",
              room: roomUpdated,
              game: dataRes,
            });
          } else {
            console.log("room not found");
          }
          break;
        }
        case "time_out": {
          if (roomDetail) {
            let resGame = await gameService.updateGameById(
              gameId,
              { isStart: false },
              gameData,
              true
            );
            const roomUpdated = await roomService.updateWinById(
              roomDetail._id,
              data.team
            );
            console.log("time_out", roomDetail._id);
            io.sockets.to(roomId).emit(ROOM_MOVE_RECEIVE, {
              board,
              type: "end_game",
              room: roomUpdated,
              game: resGame,
            });
          } else {
            console.log("room not found");
          }
          break;
        }
        case "drop_piece": {
          if (gameData.isDrop) {
            console.log(gameId, "Không được phép drop");
            io.sockets.to(roomId).emit(ROOM_MOVE_RECEIVE, null);
          }
          const { endRow, endCol } = position;
          objChest.position = { row: endRow, col: endCol };
          objUpdate.historyTemp = {
            end: { row: endRow, col: endCol },
          };
          if (objChest?.teamType === "C" && objChest.isRotate)
            objChest.rotate += 180;
          if (gameData.turn === "X") {
            objUpdate.greenPrison = gameData.greenPrison.map((chess) =>
              chess.type === objChest.type
                ? { ...chess, quantity: --chess.quantity }
                : chess
            );
          } else {
            objUpdate.orangePrison = gameData.orangePrison.map((chess) =>
              chess.type === objChest.type
                ? { ...chess, quantity: --chess.quantity }
                : chess
            );
          }
          if (gameData.status === "setup") {
            let orangeDoneSetup =
              gameData.orangePrison.filter((item) => item.quantity === 1)
                .length === 1
                ? true
                : false;
            let greenDoneSetup =
              gameData.greenPrison.filter((item) => item.quantity === 1)
                .length === 1
                ? true
                : false;
            if (!orangeDoneSetup && !greenDoneSetup) {
              objUpdate.status = "play";
            }
          }
          if (board[endRow][endCol]?.teamType === objChest.teamType) {
            let piece = board[endRow][endCol];
            if (piece.team.length) {
              piece.team.forEach((child: any) => objChest.team.push(child));
              piece.team = [];
              objChest.team.unshift({ ...piece, team: [] });
            } else {
              objChest.team.push(piece);
            }
          }
          if (
            objChest.type === ChessType.Long ||
            objChest.type === ChessType.Phuong
          ) {
            objUpdate.isMoved = false;
            objUpdate.turn = gameData.turn === "C" ? "X" : "C";
            objUpdate.history = [
              ...gameData.history,
              `${objChest.type}*${parseColRowToCharactor(endCol, endRow)}`,
            ];
            board[endRow][endCol] = objChest;
            let dataRes = await gameService.updateGameById(
              gameData._id,
              {
                board,
                isMoved: true,
                isDrop: false,
                ...objUpdate,
              },
              gameData,
              true
            );
            io.sockets.to(roomId).emit(ROOM_MOVE_RECEIVE, {
              isPlaySound: true,
              type: "done",
              position,
              game: dataRes,
            });
          } else {
            board[endRow][endCol] = objChest;
            let dataRes = await gameService.updateGameById(
              gameData._id,
              {
                board,
                isMoved: true,
                isDrop: true,
                ...objUpdate,
              },
              gameData,
              false
            );
            io.sockets.to(roomId).emit(ROOM_MOVE_RECEIVE, {
              isPlaySound: true,
              type: "move",
              position,
              game: dataRes,
            });
          }
          break;
        }
        default:
          console.log("unknnow type");
          break;
      }
    } else {
      console.error("Not found gameData!");
    }
  });
  socket.on(JOIN_GAME_SEND, async (data) => {
    const { name, _id } = socket.data.user;
    const { roomId, gameId, type } = data;
    if (roomId && gameId) {
      console.log(`${name} join game with gameId ${gameId}`);
      let roomService = new RoomService();
      switch (type) {
        case JoinGameType.JOIN: {
          let dataUpdate = await roomService.joinRoomById(roomId, _id);
          io.sockets.to(roomId).emit(JOIN_GAME_RECEIVE, {
            type: JoinGameType.JOIN,
            data: dataUpdate,
          });
          break;
        }
        case JoinGameType.START: {
          let gameService = new GameService();
          let roomDetail = await roomService.getRoomByIdNotPopulate(roomId);
          if (
            roomDetail?.status === "waiting" &&
            roomDetail.participants.findIndex((item) => item === null) === -1
          ) {
            await gameService.updateGameById(
              gameId,
              { isStart: true, status: "setup" },
              null,
              false
            );
            let roomData = await roomService.updateRoomById(roomDetail._id, {
              status: "playing",
            });
            io.emit(ROOM_RECEIVE, { type: RoomType.UPDATE, data: roomData });
            io.sockets.to(roomId).emit(JOIN_GAME_RECEIVE, {
              type: JoinGameType.START,
              data: roomData,
            });
          } else {
            console.log("room not from waiting");
          }
          break;
        }
        default:
          break;
      }
    } else {
      console.log("roomId, gameId required");
    }
  });
};
