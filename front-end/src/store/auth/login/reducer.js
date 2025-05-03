import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    API_ERROR
} from "./actionTypes"

const initialState = {
    error: "",
    user: null,
    loading: false,
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            state = {
                ...state,
                loading: true,
            }
            break
        case LOGIN_SUCCESS:
            state = {
                ...state,
                user: action.payload.user,
                loading: false,
            }
            break;
        case API_ERROR:
            state = { ...state, error: action.payload, loading: false }
            break;
        default:
            state = { ...state }
            break;
    }
    return state
}

export default auth