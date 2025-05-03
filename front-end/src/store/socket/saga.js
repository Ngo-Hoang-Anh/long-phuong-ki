import { put, takeEvery } from "redux-saga/effects";
import { DISCONNECT_SOCKET, INIT_SOCKET } from "./actionTypes";
import socketIo from 'socket.io-client';
import { initSocketSuccess, initSocketFail, disconnectSocketSuccess } from './actions'
import { getTokenUser } from "@/helpers/fetchHelper";
const host = import.meta.env.VITE_SOCKET_URL;

import Swal from 'sweetalert2'

function* onInitSocket() {
    try {
        const token = getTokenUser();
        if (token) {
            console.log('Connecting to socket server at:', host);

            // Enable reconnection with configuration
            const socket = socketIo(`${host}/`, {
                extraHeaders: {
                    authorization: token.accessToken
                },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000
            });

            // Connection established successfully
            socket.on('connect', () => {
                console.log('Socket connected successfully');
            });

            // Handle reconnection events
            socket.on('reconnect', (attemptNumber) => {
                console.log(`Socket reconnected after ${attemptNumber} attempts`);
            });

            socket.on('reconnect_attempt', (attemptNumber) => {
                console.log(`Socket reconnection attempt #${attemptNumber}`);
                // Update authorization header with fresh token on reconnect attempts
                const currentToken = getTokenUser();
                if (currentToken) {
                    socket.io.opts.extraHeaders = {
                        authorization: currentToken.accessToken
                    };
                }
            });

            socket.on('reconnect_error', (error) => {
                console.error('Socket reconnection error:', error);
            });

            socket.on('reconnect_failed', () => {
                console.error('Socket failed to reconnect after maximum attempts');
                Swal.fire({
                    title: 'Kết nối không ổn định.',
                    text: 'Không thể kết nối lại với máy chủ.',
                    showConfirmButton: true,
                    confirmButtonText: 'Tải lại trang'
                }).then(() => {
                    location.reload();
                });
            });

            // Handle disconnect events
            socket.on('disconnect', (reason) => {
                console.log('Socket disconnected, reason:', reason);

                // Only show the error message for certain disconnect reasons
                if (reason === 'transport close' || reason === 'ping timeout') {
                    // These are network-related issues that might be temporary
                    console.log('Network-related disconnect, attempting to reconnect...');
                } else if (!socket.connected && socket.io.reconnectionAttempts >= socket.io.opts.reconnectionAttempts) {
                    // Show message only after all reconnection attempts have failed
                    Swal.fire({
                        title: 'Kết nối không ổn định.',
                        text: 'Đang thử kết nối lại...',
                        showConfirmButton: true,
                        confirmButtonText: 'Tải lại trang'
                    }).then(() => {
                        location.reload();
                    });
                }
            });

            yield put(initSocketSuccess(socket))
        } else {
            window.location = '/login';
        }
    } catch (error) {
        console.error('Socket initialization error:', error);
        yield put(initSocketFail(error))
    }
}
function* onDisconnectSocket({ payload: { socket } }) {
    socket.disconnect();
    yield put(disconnectSocketSuccess())
}
function* socketSaga() {
    yield takeEvery(INIT_SOCKET, onInitSocket)
    yield takeEvery(DISCONNECT_SOCKET, onDisconnectSocket)
}

export default socketSaga
