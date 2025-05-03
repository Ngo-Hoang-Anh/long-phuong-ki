import { IUserInfo } from "interfaces/UserInfo";
import jwt from "jsonwebtoken";

export function getToken(user: object) {
    return jwt.sign(user, process.env.SECRETKEY || "@LongPhuong@", { expiresIn: '30days' })
}
export function decodeToken(token: any) {
    return jwt.verify(token, process.env.SECRETKEY || "@LongPhuong@") as IUserInfo;
}