import { USER_OFFLINE, USER_ONLINE } from '@/common/constants/SocketEventName';
import { getUserOnline } from '@/helpers/fetchHelper';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function OnlineList() {
    const socket = useSelector(state => state.socket.socketIo);
    const userData = useSelector(state => state.user.user?.data)
    const { t } = useTranslation(null, { keyPrefix: 'lobby' });
    const [listUsers, setListUsers] = useState([]);
    useEffect(() => {
        if (socket) {
            socket.on(USER_ONLINE, (data) => {
                if (!userData) return;
                if (data.data._id === userData._id) return;
                let idxUser = listUsers.findIndex(item => item._id === data.data._id)
                if (idxUser === -1) {
                    setListUsers([...listUsers, data.data])
                }
            })
            socket.on(USER_OFFLINE, (data) => {
                let arrFilter = listUsers.filter(item => item._id !== data.data._id);
                setListUsers(arrFilter);
            })
        }
        return () => {
            if (socket) {
                socket.off(USER_ONLINE)
                socket.off(USER_OFFLINE)
            }
        }
    }, [socket, listUsers, userData]);
    useEffect(() => {
        getUserOnline().then((res) => {
            if (!res.error && userData)
                setListUsers(res.data.filter(item => item._id !== userData._id))
        }).catch();
    }, [userData])
    return (
        <React.Fragment>
            <div className="lobby-inner online-inner mr-10">
                <div className='lobby-side-left-header justify-center gap-10 flex bolr-4' >
                    <i className="fa-solid fa-users"></i>
                    <div className='lu-h3 ds-ol'>{t('players_online')}</div>
                </div>

                <ul className='online-list'>
                    {userData &&
                        <Link to={`/player/${userData._id}`} className='link-un-decoration'><li key={`${userData._id}`}>{userData.name} ({t('me')})</li></Link>}
                    {listUsers ? listUsers.map((item, i) =>
                        <Link to={`/player/${item._id}`} key={`${i}-${item._id}`} className='link-un-decoration'>
                            <div className='flex'>
                                <i className="dot-ol fa-solid fa-circle" />
                                {item.name}
                            </div>
                        </Link>
                    ) : "Không có dữ liệu"}


                </ul>

            </div>
            <span className='hidden-sm'></span>
        </React.Fragment>
    )
}

export default OnlineList