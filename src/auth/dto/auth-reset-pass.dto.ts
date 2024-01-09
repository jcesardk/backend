import {IsJWT, IsStrongPassword} from "class-validator";

export class AuthResetPassDto {

    @IsJWT()
    access_token: string;

    @IsStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minUppercase: 0,
        minNumbers: 0,
        minLowercase: 0
    })
    password: string;

    @IsStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minUppercase: 0,
        minNumbers: 0,
        minLowercase: 0
    })
    confirmPassword: string;

}