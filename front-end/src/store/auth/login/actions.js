import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    API_ERROR
} from "./actionTypes"

export const loginUser = (user, history) => {
    return {
        type: LOGIN_USER,
        payload: { user, history },
    }
}

export const loginSuccess = user => {
    return {
        type: LOGIN_SUCCESS,
        payload: user,
    }
}

export const apiError = error => {
    return {
        type: API_ERROR,
        payload: error,
    }
}
