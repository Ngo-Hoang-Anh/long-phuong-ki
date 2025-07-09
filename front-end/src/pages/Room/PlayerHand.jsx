
import Proptypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useChessPieceTheme } from '../../components/common/ChessPieceThemeProvider';
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
            {<div className="count-circle"><span className="count">{chessItem.quantity}</span></div>}
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