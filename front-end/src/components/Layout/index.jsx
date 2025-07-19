import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Logo from '/image/logo.png';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

import { useTranslation } from 'react-i18next'
import MultipleLanguage from '@/components/Layout/MultipleLanguage';
import { useTheme } from '../common/ThemeProvider';
import { useChessPieceTheme } from '../common/ChessPieceThemeProvider';

function Layout(props) {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { chessTheme, setChessTheme } = useChessPieceTheme();

    const toggleChessTheme = () => {
        const newTheme = chessTheme === 'quan_co' ? 'quan_co_2' : 'quan_co';
        setChessTheme(newTheme);
    };
    useEffect(() => {
        document.title = t('header');
    }, []);
    return (
        <React.Fragment>
            <header className="header">
                <div className="lu-container">
                    <div className="header-container flex ">
                        <div className='flex'>
                            <Link to="/">
                                <img className="logo" src={Logo} alt="" />
                            </Link>
                            <div className='lu-h2'>{t('header')}</div>
                            {/* <Link to="/">
                                <img className='img-icon' src="/image/zyro-image (1).png" alt="" />
                            </Link> */}
                        </div>
                        <div className='flex gap-4'>
                            <MultipleLanguage />
                            {/* chess piece theme toggle */}
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
                            {/* theme toggle */}
                            <div>
                                <label className="switch" htmlFor="switch">
                                    <input checked={theme === 'light'} id="switch" type="checkbox" className="circle" onChange={toggleTheme} />
                                    <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" className="moon svg">
                                        !Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License
                                        - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
                                        <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                                    </svg>
                                    <div className="sun svg">
                                        <span className="dot" />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {props.children}
            <footer>
                <div className='footer-content'>
                    Trang mạng chơi cờ được tài trợ bởi Hiệp hội Long Phượng
                </div>
            </footer>
        </React.Fragment>

    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout