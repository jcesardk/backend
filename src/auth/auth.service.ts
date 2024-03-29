import {BadRequestException, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {AuthRegisterDto} from "./dto/auth-register.dto";
import * as bcrypt from 'bcrypt';
import {sendMail} from "../shared/util/mail";
import {MailerService} from "@nestjs-modules/mailer";
import {UserEntity} from "../user/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class AuthService {

    private issuer = "login";
    private audience = "users";

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {

    }

    createJwtToken(user: UserEntity) {
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
        const userClient = await this.userRepository.findOne({
            where: {
                email
            }
        });

        if (!userClient) {
            throw new BadRequestException('Email inválido!');
        }

        const token = this.jwtService.sign({
            id: userClient.id,
        }, {
            expiresIn: "15 minutes",
            subject: String(userClient.id),
            issuer: 'resetar-senha',
            audience: 'users'
        });

        return await sendMail(
            email,
            'API Report - Sua nova senha',
            'resetar-senha',
            {token},
        );
    }

    async resetPass(password: string, access_token: string){

        try {
            const  data: any = this.jwtService.verify(access_token, {
                issuer: 'resetar-senha',
                audience: 'users'
            })

            if (isNaN(Number(data.id))) {
                throw new BadRequestException('Token é invãlido')
            }

            const pass = await this.userService.hashPassword(password);
            const user = await this.userRepository.update({id: data.id}, { password: pass });
            const dataUser = await this.userRepository.findOne({
                where: {
                    id: data.id
                }
            })

            const token = this.createJwtToken(dataUser);
            return {
                ...user,
                access_token: token
            }
        } catch (e) {
            throw new BadRequestException(e)
        }

    }

    async login(email: string, password: string){

        const user = await this.userRepository.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new BadRequestException('Usuário ou senha inválido!');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Usuário ou senha inválido!');
        }

        const access_token = this.createJwtToken(user);

        return {
            ...user,
            access_token
        }
    }

    async registerUser(model: AuthRegisterDto){
        const user = await this.userService.createUser(model);
        const access_token = this.createJwtToken(user);
        return {
            ...user,
            access_token
        }
    }
}