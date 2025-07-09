import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const ChessPieceThemeContext = createContext();

export const useChessPieceTheme = () => useContext(ChessPieceThemeContext);

export const ChessPieceThemeProvider = ({ children }) => {
    const [chessTheme, setChessTheme] = useState(localStorage.getItem('chessTheme') || 'quan_co');

    const changeChessTheme = (newTheme) => {
        setChessTheme(newTheme);
        localStorage.setItem('chessTheme', newTheme);
    };

    const contextValue = useMemo(() => ({
        chessTheme,
        setChessTheme: changeChessTheme,
    }), [chessTheme]);

    return (
        <ChessPieceThemeContext.Provider value={contextValue}>
            {children}
        </ChessPieceThemeContext.Provider>
    );
};

ChessPieceThemeProvider.propTypes = {
    children: PropTypes.node
}; 