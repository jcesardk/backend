import {IsDateString, IsEmail, IsOptional, IsString, IsStrongPassword} from "class-validator";

export class CreateUserDto {

    id: number;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    // @IsDateString()
    birthAt: string;

    @IsStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minUppercase: 0,
        minNumbers: 0,
        minLowercase: 0
    })
    password: string;
}