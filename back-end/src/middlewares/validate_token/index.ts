
import { decodeToken } from 'common/auth/authentication';
import { Request, Response, NextFunction } from 'express';

export const validateAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            let user = decodeToken(token);
            if (user) {
                req.user = user;
                return next();
            }
        } catch (err) {
            console.log(err);
        }
    }
    return res.status(403).json({ error: true, msg: "Not Authorization" })
}