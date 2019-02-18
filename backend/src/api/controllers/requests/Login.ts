import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class Login {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @MinLength(10, {
        message: 'is too short',
    })
    @IsNotEmpty()
    public password: string;
}
