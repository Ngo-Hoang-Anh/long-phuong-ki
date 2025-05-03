import { NextFunction, Request, Response } from 'express';
import { LoginDto } from 'dto/Auth/LoginDto';
import { RegisterDto } from 'dto/Auth/RegisterDto';
import { AuthService } from 'services/AuthServices';

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginDto = req.body;
    const authService = new AuthService();
    try {
        let accessToken = await authService.loginUser(email, password);
        if (accessToken) {
            return res.status(200).json({ error: false, data: { ...accessToken } })
        } else {
            return res.status(401).json({ error: true, msg: "Tài khoản hoặc mật khẩu không đúng" })
        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password }: RegisterDto = req.body;
    const authService = new AuthService();
    try {
        await authService.registerUser(name, email, password);
        return res.status(200).json({ error: false })
    } catch (error: any) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({ error: true, msg: "Email đã có người sử dụng" })
        }
        next(error)
    }
}