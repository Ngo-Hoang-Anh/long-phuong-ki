import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { convertValueErrorToArray } from "common/utility/helper";
import { LoginDto } from "dto/Auth/LoginDto";
import { RegisterDto } from "dto/Auth/RegisterDto";
import { NextFunction, Request, Response } from "express";

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const loginDto = plainToClass(LoginDto, req.body);
    const errors = await validate(loginDto);
    if (errors.length > 0) {
        return res.status(400).json({ error: true, msg: convertValueErrorToArray(errors) });
    }
    next();
}
export const registerValidation = async (req: Request, res: Response, next: NextFunction) => {
    const registerDto = plainToClass(RegisterDto, req.body);
    const errors = await validate(registerDto);
    if (errors.length > 0) {
        return res.status(400).json({ error: true, msg: convertValueErrorToArray(errors) });
    }
    if (registerDto.password != registerDto.rePassword) {
        return res.status(400).json({ error: true, msg: "password and repassword not equal" })
    }
    next();
}