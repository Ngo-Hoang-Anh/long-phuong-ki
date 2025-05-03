
import { combineReducers } from "redux"


import login from "./auth/login/reducer"
import user from "./user/reducer";
import socket from "./socket/reducer"

const appReducer = combineReducers({
    login,
    user,
    socket
});
// const rootReducer = (state, action) => {
//     if (action.type === LOGOUT_USER)
//         return appReducer({}, action)
//     return appReducer(state, action)
// }
export default appReducer