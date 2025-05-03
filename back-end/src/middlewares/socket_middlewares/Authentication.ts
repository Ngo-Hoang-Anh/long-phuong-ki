import { decodeToken } from "common/auth/authentication";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

const socketAuth = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    const token = socket.handshake.headers.authorization;
    if (!token) {
        return next(new Error('Authentication'));
    }
    try {
        let tokenDecode = decodeToken(token);
        if (tokenDecode) {
            socket.data.user = tokenDecode;
            return next();
        }
        return next(new Error('Authentication'));
    } catch (err) {
        console.log(err);
        return next(new Error('Authentication'));
    }
}
export default socketAuth;