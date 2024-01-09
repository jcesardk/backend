import {IsEmail, IsStrongPassword} from "class-validator";

export class AuthLoginDto {

    @IsEmail()
    email: string

    @IsStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minUppercase: 0,
        minNumbers: 0,
        minLowercase: 0
    })
    password: string;

}