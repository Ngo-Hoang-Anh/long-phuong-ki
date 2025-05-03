import React, { useEffect } from 'react';
import { getWaitingRoom } from '@/helpers/fetchHelper';
import ButtonRoom from '@/components/common/ButtonRoom';
import Proptypes from 'prop-types'
import { useTranslation } from 'react-i18next';


function WaitingRoom({ stateWaitingRoom, onClickDeleteRoom }) {
    const [waitingRoom, setWaitingRoom] = stateWaitingRoom;
    const { t } = useTranslation(null, { keyPrefix: 'lobby' });
    useEffect(() => {
        getWaitingRoom().then(res => {
            setWaitingRoom(res.data);
        }).catch(err => {
            console.log(err)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <React.Fragment>
            <div className="lobby-inner">
                <div className='lobby-side-left-header flex justify-center gap-10 mr-10' >
                    <i className="fa-solid fa-people-roof"></i>
                    <div className='lu-h3'>{t('waiting_room')}</div>
                </div>
                <div style={{ minHeight: '250px' }} className='flex-col lobby-side-left-body mb-30'>
                    {waitingRoom.length ? waitingRoom.map(item => <ButtonRoom onClickDelete={onClickDeleteRoom} key={item._id} {...item} id={item._id} />) : t('no_rooms_available')}
                </div>
            </div>
            <span className='hidden-sm'></span>
        </React.Fragment>
    )
}

WaitingRoom.propTypes = {
    stateWaitingRoom: Proptypes.array.isRequired,
    onClickDeleteRoom: Proptypes.func.isRequired
}

export default WaitingRoom