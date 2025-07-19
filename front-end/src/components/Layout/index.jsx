import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Logo from '/image/logo.png';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

import { useTranslation } from 'react-i18next'
import MultipleLanguage from '@/components/Layout/MultipleLanguage';
import ChessToggle from '../common/ChessToggle';
import ThemeToggle from '../common/ThemeToggle';
import SettingsDropdown from '../common/SettingsDropdown';

function Layout(props) {
    const { t } = useTranslation();
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
                            {/* Desktop controls */}
                            <div className="desktop-controls">
                                <MultipleLanguage />
                                <ChessToggle />
                                <ThemeToggle />
                            </div>
                            
                            {/* Mobile settings */}
                            <SettingsDropdown />
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