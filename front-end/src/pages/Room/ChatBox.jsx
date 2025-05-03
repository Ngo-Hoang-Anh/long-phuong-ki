import { ROOM_MESSAGE_RECEIVE, ROOM_MESSAGE_SEND } from '@/common/constants/SocketEventName';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import Proptypes from 'prop-types'
import { useTranslation } from 'react-i18next';



function renderMsg({ msg, userName, time, isU, i }) {
    return (
        <div className={isU ? "talk-me" : "talk-you"} key={i}>
            <div className='flex gap-10'>
                <b>{userName}</b>
                <span className='fs-12 '>{moment(time).format('HH:mm DD/MM')}</span>
            </div>
            <span className='wrap-words talk-text'>{msg}</span>

        </div>)
}

function ChatBox({ roomId, stateMessage, participants, isChatOpen, handleCancelClick, roomStatus }) {
    const [inputMsg, setInputMsg] = useState('');
    const { t } = useTranslation(null, { keyPrefix: 'room' });
    const chatBoxRef = useRef();
    const [messages, setMessages] = stateMessage;
    const socket = useSelector(state => state.socket.socketIo);
    const userData = useSelector(state => state.user.user?.data);
    const [isDisableChat, setIsDisableChat] = useState(true)
    const handleClickSendMsg = () => {
        if (inputMsg) {
            socket.emit(ROOM_MESSAGE_SEND, { msg: inputMsg, userId: userData._id, roomId });
            setInputMsg('');
        }
    }
    const scrollToBottom = () => {
        if (chatBoxRef.current)
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    useEffect(() => {
        socket.on(ROOM_MESSAGE_RECEIVE, (data) => {
            setMessages([...messages, data]);
        });
        return () => {
            socket.off(ROOM_MESSAGE_RECEIVE);
        }
    }, [socket, messages]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleClickSendMsg();
        }
    };
    useEffect(() => {
        if (participants?.find(item => item?._id === userData._id) || roomStatus === 'waiting') {
            setIsDisableChat(false);
        } else {
            setIsDisableChat(true)
        }
    }, [participants, roomStatus])
    return (
        <React.Fragment>
            {isChatOpen &&
                <div className="lobby-inner chat-channel mr-10 chat-pp">
                    <div className='lobby-side-left-header flex justify-center gap-10 bolr-4 ' >
                        <i className="fa-brands fa-rocketchat"></i>
                        <div className='lu-h3'>{t('chat_channel')}</div>
                        <div className='hidden-xl chat-cancel' onClick={handleCancelClick}>
                            <i className="fa-regular fa-circle-xmark"></i>
                        </div>
                    </div>
                    <div className='popup-body-height'>
                        <div ref={chatBoxRef} className="popup-body">
                            {messages.map((item, i) => renderMsg({ i, msg: item.message, userName: item.userId.name, time: item.createdAt, isU: userData._id === item.userId._id }))}

                        </div>
                    </div>
                    <div className="popup-footer">
                        <input disabled={isDisableChat} onKeyDown={handleKeyPress} value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} type="text" placeholder="Message" />
                        <i onClick={isDisableChat ? null : handleClickSendMsg} className="fa-solid fa-paper-plane" style={{ fontSize: '18px' }} />
                    </div>
                </div>
            }

        </React.Fragment>
    )
}
ChatBox.propTypes = {
    roomId: Proptypes.string,
    stateMessage: Proptypes.array,
    participants: Proptypes.array,
    isChatOpen: Proptypes.bool,
    handleCancelClick: Proptypes.func,
    roomStatus: Proptypes.string
}

export default ChatBox