import { DISCONNECT_SOCKET_SUCCESS, INIT_SOCKET_FAIL, INIT_SOCKET_SUCCESS } from "./actionTypes";

const INIT_STATE = {
    socketIo: null,
    err: null
}



const Socket = (state = INIT_STATE, action) => {
    switch (action.type) {
        case INIT_SOCKET_SUCCESS:
            return {
                ...state,
                socketIo: action.payload
            }
        case INIT_SOCKET_FAIL:
            return {
                ...state,
                err: action.payload
            }
        case DISCONNECT_SOCKET_SUCCESS:
            return {
                ...state,
                socketIo: null
            }
        default:
            return state
    }
}
export default Socket;