import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ChatBox from './ChatBox';
import PlayingRoom from './PlayingRoom';
import OnlineList from './OnlineList';
import WaitingRoom from './WaitingRoom';
import { LOBBY_CHAT_RECEIVE, ROOM_RECEIVE, ROOM_SEND } from '@/common/constants/SocketEventName';
import { RoomType } from '@/common/constants/Varibles';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom'
import ModalCreateRoom from './ModalCreateRoom';
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next';

function LobbyGame() {
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const { t } = useTranslation(null, { keyPrefix: 'lobby' });
    const [waitingRoom, setWaitingRoom] = useState([]);
    const [playingRoom, setPlayingRoom] = useState([]);
    const socket = useSelector(state => state.socket.socketIo);
    const userData = useSelector(state => state.user.user?.data);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    useEffect(() => {
        socket.on(LOBBY_CHAT_RECEIVE, (data) => {
            setMessages([...messages, data]);
        });
        return () => {
            socket.off(LOBBY_CHAT_RECEIVE);
        }
    }, [socket, messages]);
    useEffect(() => {
        if (socket) {
            socket.on(ROOM_RECEIVE, ({ type, data }) => {
                if (type === RoomType['CREATE']) {
                    if (userData._id !== data.ownerId) {
                        return setWaitingRoom([...waitingRoom, data])
                    }
                    setTimeout(() => {
                        history.push(`/${data._id}`)
                    }, 1500);
                    toast.success(t('create_room_success'));
                    setWaitingRoom([...waitingRoom, data])
                }
                if (type === RoomType['UPDATE']) {
                    if (data.status === 'playing') {
                        setPlayingRoom(() => [data, ...playingRoom])
                        setWaitingRoom(() => waitingRoom.filter(i => i._id !== data._id))
                    }
                }
                if (type === RoomType['DELETE']) {
                    if (data.roomId) {
                        setPlayingRoom((preData) => preData.filter(item => item._id !== data.roomId))
                        setWaitingRoom((preData) => preData.filter(item => item._id !== data.roomId))
                    }
                }
            })
        }
        return () => {
            if (socket) {
                socket.off(ROOM_RECEIVE);
            }
        }
    }, [socket, waitingRoom, history, userData._id])
    const onClickCreateRoom = () => {
        toggle();
    }
    const onClickSuccess = (data) => {
        if (socket) {
            const objRoom = {
                type: RoomType['CREATE'],
                ...data
            }
            socket.emit(ROOM_SEND, objRoom);
            modal && toggle();
        }
    }
    const onClickDeleteRoom = (roomId, roomName) => {
        Swal.fire({
            title: t('are_you_sure_delete_room') + `: ${roomName}`,
            showDenyButton: true,
            confirmButtonText: t('confirm'),
            denyButtonText: t('cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit(ROOM_SEND, { type: RoomType['DELETE'], roomId });
                Swal.fire(t('deleted'), "", "success");
            }
        });
    }
    const handleLogout = () => {
        localStorage.clear();
        history.push('/login');
        window.location.reload();
    }
    return (
        <React.Fragment>
            <div className='lobby'>
                <div className="lu-container">
                    <div className="lobby-container">
                        <section className="lobby-side-left">
                            <WaitingRoom stateWaitingRoom={[waitingRoom, setWaitingRoom]} onClickDeleteRoom={onClickDeleteRoom} />
                            <PlayingRoom statePlayingRoom={[playingRoom, setPlayingRoom]} onClickDeleteRoom={onClickDeleteRoom} />
                            <OnlineList />
                            <ChatBox />
                        </section>
                        <section className="lobby-side-right ">

                            <div className="account-name-inner">
                                <div className="account-name">
                                    <span className='text-acc'>{userData && userData.name}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', minWidth: '50%' }}>
                                <button style={{ fontSize: '16px' }} onClick={handleLogout} className="btn btn-info btn-lg">
                                    <i className="fa-solid fa-right-from-bracket"></i> {t('log_out')}
                                </button>

                            </div>
                            <div className="flex-col lobby-side-right-btn lu-gap-4">
                                <button onClick={onClickCreateRoom} className='search-fr'>{t('create_room')}</button>
                                {/* <button className='account-room'>Tìm bạn</button> */}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
            <ModalCreateRoom
                modal={modal}
                toggle={toggle}
                onClickSuccess={onClickSuccess}
            />
        </React.Fragment>

    )
}

export default LobbyGame