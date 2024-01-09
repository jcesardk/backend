import {IsJWT} from "class-validator";

export class AuthMeDto {

    @IsJWT()
    access_token: string;

}