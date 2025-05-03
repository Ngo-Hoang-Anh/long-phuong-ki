import {
    GET_USER_INFO,
    GET_USER_INFO_SUCCESS
} from "./actionTypes"

export const getUserInfoSuccess = (user) => {
    return {
        type: GET_USER_INFO_SUCCESS,
        payload: user
    }
}
export const getUserInfo = () => {
    return {
        type: GET_USER_INFO
    }
}

