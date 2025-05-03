import { IsString, Length } from 'class-validator';

export class LoginDto {
    @IsString()
    @Length(1, 36655)
    msg: string;
}