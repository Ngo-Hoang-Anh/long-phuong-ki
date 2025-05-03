
import { del, get, post, put } from "./axiosHelper";
import * as url from "./urlHelper";

export const getTokenUser = () => {
    const token = localStorage.getItem("authUser");
    if (token) return JSON.parse(token);
    return null;
};
//Auth
export const postRegister = (data) => post(url.POST_REGISTER, data);

//User
export const postLogin = (data) => post(url.POST_LOGIN, data);
export const getUser = () => get(url.GET_USER_INFO);
export const getUserOnline = () => get(url.GET_USER_ONLINE);

//Room
export const getWaitingRoom = () => get(url.GET_WAITING_ROOM);
export const getPlayingRoom = () => get(url.GET_PLAYING_ROOM);
export const getDetailRoom = (id) => get(url.GET_DETAIL_ROOM(id));


//player history
export const getHistoryPlayer = (id) => get(url.GET_HISTORY_PLAYER(id));