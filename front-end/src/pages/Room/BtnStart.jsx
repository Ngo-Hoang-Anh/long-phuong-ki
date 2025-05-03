import { useState } from 'react';
import Timer from './StopWatch';

const ParentComponent = () => {
    const [isActive, setIsActive] = useState(false);

    const handleToggle = () => {
        setIsActive((prevIsActive) => !prevIsActive);
    };

    return (
        <div>
            <Timer onToggle={handleToggle} isActive={isActive} />
            <button className='btn-watch' onClick={handleToggle}>{isActive ? 'Stop' : 'Start'}</button>
        </div>
    );
};

export default ParentComponent;

