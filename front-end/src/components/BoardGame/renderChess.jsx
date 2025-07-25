import Proptypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChessPieceTheme } from '../common/ChessPieceThemeProvider';

function RenderChess({ chessBoard, roomDetail, onClickChess, isOrange, pickChess }) {
    const { chessTheme } = useChessPieceTheme();
    const userData = useSelector(state => state.user.user?.data);
    // eslint-disable-next-line no-unused-vars
    const [renderBoard, setRenderBoard] = useState([]);
    const [selectedChess, setSelectedChess] = useState(null);

    // Function to get count circle color based on team
    const getCountCircleColor = (teamType) => {
        switch (teamType) {
            case 'C': // Team C (usually first player)
                return '#4CAF50'; // Green
            case 'X': // Team X (usually second player)
                return '#FF9800'; // Orange
            default:
                return '#4CAF50'; // Default green
        }
    };
    useEffect(() => {
        if (roomDetail.participants[0]?._id === userData._id) {
            const reversed = [...chessBoard.map(item => item.slice().reverse()).slice().reverse()];
            setRenderBoard(() => reversed);
        } else {
            setRenderBoard(chessBoard);
        }
    }, [chessBoard, roomDetail.participants]);
    useEffect(() => {
        setSelectedChess(pickChess);
    }, [pickChess])
    return (
        renderBoard.map((row, iRow) => (
            row.map((col, iCol) => {
                let chessItem = renderBoard[iRow][iCol];
                let rowVerse = isOrange ? 8 - iRow : iRow;
                let colVerse = isOrange ? 8 - iCol : iCol;
                let isSelectedPosition = selectedChess?.position?.row === rowVerse && selectedChess?.position?.col === colVerse;
                let isHistoryClass = (rowVerse === roomDetail.gameId.historyTemp?.start?.row && colVerse === roomDetail.gameId.historyTemp?.start?.col) ||
                    (rowVerse === roomDetail.gameId.historyTemp?.end?.row && colVerse === roomDetail.gameId.historyTemp?.end?.col)
                return (
                    <div
                        key={iCol}
                        className={`square ${isSelectedPosition ? 'selected-chess' : ''} ${isHistoryClass ? 'history-move' : ''} ${chessItem?.isRecommed ? 'recommend-move' : ''}`}
                        onClick={onClickChess(chessItem?.teamType ? chessItem : { ...chessItem, position: { row: rowVerse, col: colVerse } })}
                    >
                        {(col && chessItem.teamType) ?
                            <div
                                className='wrapper-chess-square'
                            >
                                <img
                                    style={{
                                        transform: `rotate(${isOrange ? chessItem.rotate + 180 : chessItem.rotate}deg)`,
                                        pointerEvents: 'none'
                                    }}
                                    className="chess-square"
                                    src={`./image/${chessTheme}/${chessItem.name}.png`}
                                    alt=""
                                />
                                {
                                    chessItem.team.length > 0 && (
                                        <div
                                            className="count-circle"
                                            style={{ backgroundColor: getCountCircleColor(chessItem.teamType || null) || '#ccc' }}
                                        >
                                            <span className="count">{(chessItem.team.length || 0) + (chessItem.team.length !== 0 ? 1 : 0)}</span>
                                        </div>
                                    )
                                }
                            </div>
                            : null}
                    </div>
                )
            })
        ))
    )
}

RenderChess.propTypes = {
    chessBoard: Proptypes.array.isRequired,
    roomDetail: Proptypes.object,
    onClickChess: Proptypes.func,
    isOrange: Proptypes.bool,
    pickChess: Proptypes.object
}
export default RenderChess