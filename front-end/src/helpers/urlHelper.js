export const POST_REGISTER = "/api/register";
export const POST_LOGIN = "/api/login";
//User
export const GET_USER_INFO = "/api/user/info"
export const GET_USER_ONLINE = "/api/user/getOnline"
//Room
export const GET_WAITING_ROOM = "/api/room/getWaiting"
export const GET_PLAYING_ROOM = "/api/room/getPlaying"
export const GET_DETAIL_ROOM = (id) => `/api/room/${id}`
export const GET_HISTORY_PLAYER = (id) => `/api/user/history/${id}`