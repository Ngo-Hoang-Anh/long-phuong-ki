import { IUserInfo } from "interfaces/UserInfo";

import * as express from "express"
import { Server } from "socket.io";
declare global {
    namespace Express {
        interface Request {
            user: IUserInfo
        }
    }
}