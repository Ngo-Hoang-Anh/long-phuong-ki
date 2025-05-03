/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import Proptypes from 'prop-types'
import { checkIsSameType, checkMate, checkRedZone, isValidMove, recommendMove } from './engine';
import { ChessType, lettersCount, numCount } from '@/common/constants/Enum';
import { useSelector } from 'react-redux';
import { ROOM_MOVE_SEND } from '@/common/constants/SocketEventName';
import useAllowPlayGame from '@/common/hooks/useAllowPlayGame';
import RenderChess from './renderChess';

const StackableChess = ({ satePickChess, sateChessBoard, roomDetail, gameId, isMoveTeam, setIsClick }) => {
    const [chessboard, setChessboard] = sateChessBoard;
    const userData = useSelector(state => state.user.user?.data);
    const isAllow = useAllowPlayGame({ roomDetail });
    const [recommendList, setRecommedList] = useState([]);
    const [isOrange, setIsOrange] = useState(roomDetail.participants[0]?._id === userData._id);
    const [rowAndCol, setRowAndCol] = useState({ row: numCount, col: lettersCount, isReversed: false });
    const [pickChess, setPickChess] = satePickChess;
    const socket = useSelector(state => state.socket.socketIo);
    const resetReccomandChess = useCallback(() => {
        setChessboard((preChess) => preChess.map((row) => row.map(item => item?.isRecommed ? { ...item, isRecommed: false } : item)));
        setPickChess(null);
    }, [setChessboard, setPickChess]);
    useEffect(() => {
        if (isAllow) {
            // let isCheckMate = checkMate(roomDetail.gameId.turn, roomDetail.gameId.board);
            let redZone = checkRedZone(roomDetail.gameId.turn, roomDetail.gameId.board);
            // if (isCheckMate) {
            //     socket.emit(ROOM_MOVE_SEND, {
            //         type: 'time_out',
            //         gameId,
            //         roomId: roomDetail._id,
            //         team: roomDetail.gameId.turn
            //     })
            // }
            if (redZone && !roomDetail.gameId.isMoved) {
                socket.emit(ROOM_MOVE_SEND, {
                    type: 'time_out',
                    gameId,
                    roomId: roomDetail._id,
                    team: roomDetail.gameId.turn === 'C' ? 'X' : 'C'
                })
            }
        }
    }, [roomDetail.gameId.board, roomDetail.gameId.turn]);
    useEffect(() => {
        if (roomDetail.participants[0]?._id === userData._id && !rowAndCol.isReversed) {
            setRowAndCol((pre) => {
                return ({
                    row: [...pre.row].reverse(),
                    col: [...pre.col].reverse(),
                    isReversed: true
                })
            })
            setIsOrange(roomDetail.participants[0]?._id === userData._id);
        }
    }, [roomDetail.participants]);
    const onClickChess = useCallback((chess) => () => {
        if (!isAllow) return;
        if (pickChess) {
            // if(chess.teamType)
            if (!pickChess?.position) return setPickChess(null);
            const startRow = pickChess.position.row;
            const startCol = pickChess.position.col;
            const endRow = chess.position.row;
            const endCol = chess.position.col;
            if (isAllow !== pickChess?.teamType) return setPickChess(null); // check teamType move
            try {
                if (pickChess.position.row === -1 || pickChess.position.col === -1) { // check tù binh thả tù binh vào bàn 
                    if (roomDetail.gameId.isDrop) return;
                    if (!pickChess.quantity || pickChess.quantity <= 0) return setChessboard([...chessboard]);
                    if (roomDetail.gameId.status === 'setup') { //check setup
                        chessboard.forEach((row) => row.forEach(item => item?.isRecommed ? item.isRecommed = false : null)); // set all recommend to false  
                        if ((endRow === 1 && isAllow === 'C') || (endRow === 7 && isAllow === 'X')) {// check only row = 1 or 7
                            setIsClick(false);
                            socket.emit(ROOM_MOVE_SEND, {
                                isMoveTeam,
                                pickChess,
                                gameId,
                                roomId: roomDetail._id,
                                position: { endCol, endRow },
                                objChest: pickChess,
                                type: "drop_piece"
                            })
                        }
                    }
                    if (roomDetail.gameId.status === 'play') { // none setup
                        if (chessboard[endRow][endCol].isRecommed) {
                            setIsClick(false);
                            socket.emit(ROOM_MOVE_SEND, {
                                isMoveTeam,
                                pickChess,
                                gameId,
                                roomId: roomDetail._id,
                                position: { endCol, endRow },
                                objChest: pickChess,
                                type: "drop_piece"
                            })
                        }
                        chessboard.forEach((row) => row.forEach(item => item?.isRecommed ? item.isRecommed = false : null)); // set all recommend to false 
                    }
                } else {
                    recommendList.forEach(cor => chessboard[cor.row][cor.col].isRecommed = false);
                    if (startRow === endRow && startCol === endCol) return resetReccomandChess();
                    if (startCol === endCol && startRow === endRow) return resetReccomandChess();
                    if (roomDetail.gameId.status === 'setup') return; // check setup game
                    if (isValidMove(endRow, endCol, chessboard[startRow][startCol], recommendList)) {
                        setIsClick(false);
                        let isSameType = checkIsSameType({ col: endCol, row: endRow, chessboard, piece: chessboard[startRow][startCol] });
                        socket.emit(ROOM_MOVE_SEND, {
                            isMoveTeam,
                            type: 'move',
                            isSameType,
                            chessboard,
                            gameId,
                            roomId: roomDetail._id,
                            position: { startRow, startCol, endRow, endCol },
                            objChest: pickChess,
                        });
                    } else {
                        console.log('invalid move')
                        setPickChess(null);
                    }
                }
            } catch (e) {
                console.log(e)
            }
            return setChessboard([...chessboard]);
        } else {
            if (!chess.teamType) return;
            setPickChess(chess);
            if (roomDetail.gameId.isMoved) {
                return;
            }
            const row = chess.position.row;
            const col = chess.position.col;
            if (chess.teamType !== isAllow) return setPickChess(null);
            chessboard.forEach((row) => row.forEach(item => item?.isRecommed ? item.isRecommed = false : null)); // set all recommend to false 
            let arrRecs = recommendMove(row, col, chessboard[row][col], chessboard);
            let arrFilter = arrRecs.filter(objRec => {
                const targetSquare = chessboard[objRec.row][objRec.col];
                const curSquare = chessboard[row][col];
                if (chess.team.length > 0 && targetSquare?.teamType === curSquare.teamType) return false;
                if (targetSquare) {
                    if (targetSquare.type === ChessType.Vuong && targetSquare.teamType === curSquare.teamType)
                        return false
                    if (curSquare.type === ChessType.Vuong) {
                        if (targetSquare.type && targetSquare.teamType === curSquare.teamType) return false
                    }
                }
                if (targetSquare === null || targetSquare !== undefined) {
                    chessboard[objRec.row][objRec.col] = { ...targetSquare, isRecommed: true }
                    return true
                }
                return false
            })
            setRecommedList(arrFilter);
            setChessboard([...chessboard]);
        }
    }, [chessboard, gameId, isAllow, isMoveTeam, pickChess, recommendList, resetReccomandChess, roomDetail._id, roomDetail.gameId.isMoved, roomDetail.gameId.status, setChessboard, setPickChess, socket]);
    return (
        <div className='rooms-1300'>
            <div className='num-count'>
                {rowAndCol.row.map(item => <span key={item}>{item}</span>)}
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ userSelect: 'none' }} id="chessboard" className="chessboard">
                    <RenderChess
                        pickChess={pickChess}
                        chessBoard={chessboard}
                        roomDetail={roomDetail}
                        onClickChess={onClickChess}
                        isOrange={isOrange}
                    />
                </div>
                <div className='letters-chess'>
                    {rowAndCol.col.map(item => <span key={item}>{item}</span>)}
                </div>
            </div>
        </div>
    );

};

StackableChess.propTypes = {
    satePickChess: Proptypes.array.isRequired,
    sateChessBoard: Proptypes.array.isRequired,
    chessFromPrison: Proptypes.string,
    statePrisonOrange: Proptypes.array,
    statePrisonGreen: Proptypes.array,
    roomDetail: Proptypes.object,
    gameId: Proptypes.string,
    isMoveTeam: Proptypes.bool,
    setIsClick: Proptypes.func
}
export default StackableChess;
