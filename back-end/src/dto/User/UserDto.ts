import { IsString, IsEmail, Length } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;
}