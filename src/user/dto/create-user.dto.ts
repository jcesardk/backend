import {IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword} from "class-validator";
import {Roles} from "../../decorators/roles.decorators";
import {RoleEnum} from "../../enums/role.enum";

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

    @IsOptional()
    @IsEnum(RoleEnum)
    perfil: number;
}