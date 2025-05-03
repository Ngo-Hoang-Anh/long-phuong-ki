import { DISCONNECT_SOCKET, DISCONNECT_SOCKET_FAIL, DISCONNECT_SOCKET_SUCCESS, INIT_SOCKET, INIT_SOCKET_FAIL, INIT_SOCKET_SUCCESS } from "./actionTypes";


export const initSocket = () => ({
    type: INIT_SOCKET
})
export const initSocketSuccess = (socket) => ({
    type: INIT_SOCKET_SUCCESS,
    payload: socket
})

export const initSocketFail = (err) => ({
    type: INIT_SOCKET_FAIL,
    payload: err
})

export const disconnectSocket = (socket) => ({
    type: DISCONNECT_SOCKET,
    payload: { socket }
})
export const disconnectSocketSuccess = () => ({
    type: DISCONNECT_SOCKET_SUCCESS
})

export const disconnectSocketFail = (err) => ({
    type: DISCONNECT_SOCKET_FAIL,
    payload: err
})
