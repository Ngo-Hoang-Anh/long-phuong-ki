
import { useChessPieceTheme } from './ChessPieceThemeProvider';

const ChessToggle = () => {
    const { chessTheme, setChessTheme } = useChessPieceTheme();

    const toggleChessTheme = () => {
        const newTheme = chessTheme === 'quan_co' ? 'quan_co_2' : 'quan_co';
        setChessTheme(newTheme);
    };

    return (
        <div className="chess-toggle-container">
            <label className="chess-switch" htmlFor="chess-switch">
                <input 
                    checked={chessTheme === 'quan_co'} 
                    id="chess-switch" 
                    type="checkbox" 
                    className="chess-circle" 
                    onChange={toggleChessTheme} 
                />
            </label>
            <div className="chess-indicator">
                <div className={`chess-piece ${chessTheme === 'quan_co' ? 'active' : ''}`}>
                    <img src="/image/quan_co/VC.png" alt="Default" />
                </div>
                <div className={`chess-piece ${chessTheme === 'quan_co_2' ? 'active' : ''}`}>
                    <img src="/image/quan_co_2/VX.png" alt="Theme 2" />
                </div>
            </div>
        </div>
    );
};

export default ChessToggle; 