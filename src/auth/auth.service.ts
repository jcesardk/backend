import {BadRequestException, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prima/prisma.service";
import {User} from "@prisma/client";
import {UserService} from "../user/user.service";
import {AuthRegisterDto} from "./dto/auth-register.dto";

@Injectable()
export class AuthService {

    private issuer = "login";
    private audience = "users";

    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly userService: UserService
    ) {

    }

    createJwtToken(user: User) {
        user.password = '';
        return this.jwtService.sign({
            user
        }, {
            expiresIn: "1 days",
            subject: String(user.id),
            issuer: this.issuer,
            audience: this.audience
        });
    }

    isValidToken(access_token: string) {
        try {
            this.checkToken(access_token);
            return true;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    checkToken(access_token: string) {
        try {
            return this.jwtService.verify(access_token, {
                issuer: this.issuer,
                audience: this.audience
            })
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async forgetPass(email: string){
        const userClient = await this.prismaService.user.findFirst({
            where: {
                email
            }
        });

        if (!userClient) {
            throw new BadRequestException('Email inválido!');
        }

        //TO DO: Enviar o email

        return true;
    }

    async resetPass(password: string, access_token: string){
        // TO DO: validar token

        const id = 0;
        const user = await this.prismaService.user.update({
            data: {password},
            where: {
                id
            }
        });

        return this.createJwtToken(user);
    }

    async login(email: string, password: string){

        const user = await this.prismaService.user.findFirst({
            where: {
                email,
                password
            }
        });

        if (!user) {
            throw new BadRequestException('Usuário ou senha inválido!');
        }

        const access_token = await this.createJwtToken(user);

        return {
            ...user,
            access_token
        }
    }

    async registerUser(model: AuthRegisterDto){
        const user = await this.userService.createUser(model);
        const access_token = await this.createJwtToken(user);
        return {
            ...user,
            access_token
        }
    }
}