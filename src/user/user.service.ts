import {BadRequestException, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UpdatePatchUserDto} from "./dto/update-patch-user.dto";
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import {Repository} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
    }
    async createUser(user: CreateUserDto) {
        const dataNascimento = moment(user.birthAt, 'DD/MM/YYYY').toDate();
        delete user.birthAt;
        user.password = await this.hashPassword(user.password);
        const existeEmail = await this.userRepository.findOne({
            where: {
                email: user.email
            }
        })

        // if (!user.perfil) {
        //     throw new BadRequestException('Por favor informe o perfil!');
        // }

        if (existeEmail) {
            throw new BadRequestException('Usuário já cadastrado!');
        }

        return this.userRepository.save({
            birthAt: dataNascimento ? dataNascimento : null,
            ...user
        });
    }

    async hashPassword(password: string) {
        return await bcrypt.hash(password, await bcrypt.genSalt());
    }

    async listAllUsers() {
        return this.userRepository.find();
    }

    async searchUser(id: number) {
        await this.validaSeUserExiste(id);
        return this.userRepository.findOneBy({id});
    }

    async updateUser(id: number, user: UpdateUserDto) {
        await this.validaSeUserExiste(id)
        const data: any = {};
        if (user.birthAt) {
            data.birthAt = moment(user.birthAt, 'DD/MM/YYYY').toDate()
        }
        if (user.email) {
            data.email = user.email
        }
        if (user.name) {
            data.name = user.name
        }
        if (user.password) {
            data.password = await this.hashPassword(user.password);
        }
        if (user.perfil) {
            data.perfil = user.perfil
        }
        await this.userRepository.update(id, data)

        return this.searchUser(id);
    }

    async updateUserPartial(id: number, user: UpdatePatchUserDto) {
        await this.validaSeUserExiste(id);
        const data: any = {};
        if (user.birthAt) {
            data.birthAt = moment(user.birthAt, 'DD/MM/YYYY').toDate()
        }
        if (user.email) {
            data.email = user.email
        }
        if (user.name) {
            data.name = user.name
        }
        if (user.password) {
            data.password = await this.hashPassword(user.password);
        }
        if (user.perfil) {
            data.perfil = user.perfil
        }

        console.warn('PASSWORD', data)
        await this.userRepository.update(id, data);

        return this.searchUser(id);
    }

    async delete(id: number) {
        await this.validaSeUserExiste(id);
        return this.userRepository.delete(id);
    }

    async validaSeUserExiste(id: number) {
        const usuarioExiste = await this.userRepository.findOneBy({id});
        if (!usuarioExiste) {
            throw new HttpException('Usuário não encontrado!', HttpStatus.BAD_REQUEST);
        }
    }
}