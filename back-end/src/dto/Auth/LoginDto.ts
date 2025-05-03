import { IsString, IsEmail, Length } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 255)
    password: string;
}