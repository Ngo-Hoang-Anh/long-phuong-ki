import { IsString, IsEmail, Length } from 'class-validator';

export class RegisterDto {
    @IsString()
    @Length(2, 255)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 255)
    password: string;

    @IsString()
    @Length(6, 255)
    rePassword: string;
}