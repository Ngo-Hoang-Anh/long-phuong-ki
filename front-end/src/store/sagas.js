import { all, fork } from "redux-saga/effects"
import AuthSaga from "./auth/login/saga"
import UserSaga from "./user/saga"
import socketSaga from "./socket/saga"

export default function* rootSaga() {
    yield all([
        fork(AuthSaga),
        fork(UserSaga),
        fork(socketSaga),
    ])
}
