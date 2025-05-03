import ButtonRoom from '@/components/common/ButtonRoom';
import { getPlayingRoom } from '@/helpers/fetchHelper';
import React, { useEffect } from 'react'
import Proptypes from 'prop-types'
import { useTranslation } from 'react-i18next';



function PlayingRoom({ statePlayingRoom, onClickDeleteRoom }) {
    const [playingRoom, setPlayingRoom] = statePlayingRoom;
    const { t } = useTranslation(null, { keyPrefix: 'lobby' });
    useEffect(() => {
        getPlayingRoom().then(res => {
            setPlayingRoom(res.data);
        }).catch(err => {
            console.log(err)
        })
    }, []);
    return (
        <React.Fragment>
            <div className="lobby-inner  ">
                <div className='lobby-side-left-header flex  justify-center gap-10 mr-10'>
                    <i className="fa-solid fa-house-user"></i>
                    <div className='lu-h3'>{t('active_rooms')}</div>

                </div>
                <div style={{ minHeight: '250px' }} className='flex-col lobby-side-left-body mb-30' >
                    {playingRoom.length ? playingRoom.map(item => <ButtonRoom onClickDelete={onClickDeleteRoom} key={item._id} {...item} id={item._id} />) : t('no_rooms_available')}
                </div>
            </div>
            <span className='hidden-sm'></span>
        </React.Fragment>
    )
}

PlayingRoom.propTypes = {
    statePlayingRoom: Proptypes.array.isRequired,
    onClickDeleteRoom: Proptypes.func.isRequired
}

export default PlayingRoom