import { useState, useEffect } from 'react';
import MultipleLanguage from '../Layout/MultipleLanguage';
import ChessToggle from './ChessToggle';
import ThemeToggle from './ThemeToggle';

const SettingsDropdown = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    // Đóng dropdown khi click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.mobile-settings')) {
                setIsSettingsOpen(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className='mobile-settings'>
            <button className='settings-btn' onClick={toggleSettings}>
                <i className="fa-solid fa-cog"></i>
            </button>
            
            {isSettingsOpen && (
                <div className='settings-dropdown'>
                    <div className='settings-item'>
                        <MultipleLanguage />
                    </div>
                    <div className='settings-item'>
                        <ChessToggle />
                    </div>
                    <div className='settings-item'>
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsDropdown; 