import {IsEmail} from "class-validator";

export class AuthForgetPassDto {

    @IsEmail()
    email: string

}