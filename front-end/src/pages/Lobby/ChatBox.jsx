import { LOBBY_CHAT_RECEIVE, LOBBY_CHAT_SEND } from '@/common/constants/SocketEventName';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getUserIdLocal } from '@/helpers/helper';
import moment from 'moment/moment';
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

function ChatBox() {
    const [inputMsg, setInputMsg] = useState('');
    const { t } = useTranslation(null, { keyPrefix: 'lobby' });
    const chatBoxRef = useRef();
    const [messages, setMessages] = useState([]);
    const socket = useSelector(state => state.socket.socketIo);
    const userData = useSelector(state => state.user.user?.data)
    const handleClickSendMsg = () => {
        if (inputMsg) {
            socket && socket.emit(LOBBY_CHAT_SEND, { msg: inputMsg, userId: getUserIdLocal() });
            setInputMsg('');
        }
    }
    const scrollToBottom = () => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.on(LOBBY_CHAT_RECEIVE, (data) => {
                setMessages([...messages, data]);
            });
        }
        return () => {
            if (socket) {
                socket.off(LOBBY_CHAT_RECEIVE);
            }
        }
    }, [socket, messages]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleClickSendMsg();
        }
    };
    return (
        <React.Fragment>
            <div className="lobby-inner chat-channel mr-10">
                <div className='lobby-side-left-header flex  justify-center gap-10 bolr-4' >
                    <i className="fa-brands fa-rocketchat"></i>
                    <div className='lu-h3 '>{t('chat_channel')}</div>
                </div>
                <div className='popup-body-height'>
                    <div ref={chatBoxRef} className="popup-body">
                        {messages.map((item, i) => renderMsg({ i, msg: item.msg, userName: item.userName, time: item.time, isU: userData._id === item._id }))}

                    </div>
                </div>
                <div className="popup-footer">
                    <input onKeyDown={handleKeyPress} value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} type="text" placeholder="Message" />
                    <i onClick={handleClickSendMsg} className="fa-solid fa-paper-plane" />
                </div>
            </div>
        </React.Fragment>
    )
}

export default ChatBox