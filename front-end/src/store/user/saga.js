import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { GET_USER_INFO } from "./actionTypes"
import { getUserInfoSuccess } from "./actions"

import {
    getUser
} from "../../helpers/fetchHelper.js";
function* getUserInfo() {
    try {
        const response = yield call(getUser);
        yield put(getUserInfoSuccess(response));
    } catch (error) {
        const message = error.response.data.msg;
        console.log(message);
    }
}


function* authSaga() {
    yield takeEvery(GET_USER_INFO, getUserInfo)
}

export default authSaga
