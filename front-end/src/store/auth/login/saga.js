import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER } from "./actionTypes"
import { apiError, loginSuccess } from "./actions"

import {
    postLogin,
} from "../../../helpers/fetchHelper.js";

function* loginUser({ payload: { user, history } }) {
    try {
        const response = yield call(postLogin, {
            email: user.email,
            password: user.password,
        })
        localStorage.setItem("authUser", JSON.stringify(response.data))
        yield put(loginSuccess(response.data));
        history.push("/lobby")
    } catch (error) {
        const message = error.response.data.msg;
        yield put(apiError(message))
    }
}

function* authSaga() {
    yield takeEvery(LOGIN_USER, loginUser)
}

export default authSaga
