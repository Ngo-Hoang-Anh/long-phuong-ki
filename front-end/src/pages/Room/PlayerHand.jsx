
import Proptypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useChessPieceTheme } from '../../components/common/ChessPieceThemeProvider';
const getCountCircleColor = (teamType) => {
    switch (teamType) {
        case 'C':
            return '#4CAF50'; // Green
        case 'X':
            return '#FF9800'; // Orange
        default:
            return '#4CAF50';
    }
};
const PlayerHand = ({ prisons, handleClickChess, isAllow, isResverse }) => {
    const { chessTheme } = useChessPieceTheme();
    const [state, setState] = useState([]);
    useEffect(() => {
        if (isResverse) {
            setState(() => [...prisons].reverse())
        } else {
            setState(() => prisons)
        }
    }, [prisons, isResverse])
    return state.map((chessItem, i) => (
        <div
            key={`${i}-${chessItem.type}`}
            className='chess-size'
            onClick={isAllow && chessItem.quantity ? handleClickChess(chessItem, isAllow) : null}
        >
            <img
                className="chess-square"
                src={`./image/${chessTheme}/${chessItem.name}.png`}
                alt="co"
                style={{
                    transform: `rotate(${chessItem.rotate}deg)`,
                    pointerEvents: 'none'
                }}
            />
            {chessItem.quantity > 0 && (
                <div className="count-circle" style={{ backgroundColor: getCountCircleColor(chessItem.teamType || null) || '#ccc' }}>
                    <span className="count">{chessItem.quantity}</span>
                </div>
            )}
        </div>
    ))
}
PlayerHand.propTypes = {
    prisons: Proptypes.array,
    handleClickChess: Proptypes.func,
    isAllow: Proptypes.any,
    isResverse: Proptypes.bool
}
export default PlayerHand