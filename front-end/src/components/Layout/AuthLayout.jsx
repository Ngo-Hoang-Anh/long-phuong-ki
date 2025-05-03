/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo, initSocket } from '@/store/actions';
import { SOCKET_ERROR } from '@/common/constants/SocketEventName';
import { toast } from 'react-toastify';

function AuthLayout(props) {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.user?.data)
    const socket = useSelector(state => state.socket.socketIo);
    useEffect(() => {
        dispatch(getUserInfo());
    }, [])
    useEffect(() => {
        if (!socket) {
            dispatch(initSocket());
        }
    }, [socket]);
    useEffect(() => {
        if (socket) {
            socket.on(SOCKET_ERROR, ({ msg }) => {
                if (msg) {
                    toast.error(msg);
                }
            })
        }
        return () => {
            if (socket) {
                socket.off(SOCKET_ERROR);
            }
        }
    }, [socket])
    return (
        userData && socket ? (<React.Fragment >
            {props.children}
        </React.Fragment>) : "Loading"
    )
}
AuthLayout.propTypes = {
    children: PropTypes.object
}

export default AuthLayout