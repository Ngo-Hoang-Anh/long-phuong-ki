import {
    GET_USER_INFO_SUCCESS,
} from "./actionTypes"

const initialState = {
    error: "",
    user: null
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_INFO_SUCCESS:
            state = { ...state, user: action.payload }
            break;
        default:
            state = { ...state }
            break;
    }
    return state
}

export default user