import {BadRequestException, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {PrismaService} from "../prima/prisma.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UpdatePatchUserDto} from "./dto/update-patch-user.dto";
import * as moment from 'moment';
import {makeLogger} from "ts-loader/dist/logger";

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {
    }
    async createUser(user: CreateUserDto) {
        const dataNascimento = moment(user.birthAt, 'DD/MM/YYYY').toDate()
        delete user.birthAt;
        const existeEmail = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        if (existeEmail) {
            throw new BadRequestException('Usuário já cadastrado!');
        }
        return this.prisma.user.create({data: {birthAt: dataNascimento ? dataNascimento : null, ...user}});
    }

    async listAllUsers() {
        return this.prisma.user.findMany();
    }

    async searchUser(id: number) {
        await this.validaSeUserExiste(id);
        return this.prisma.user.findUnique({
            where: {
                id
            }
        })
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
            data.password = user.password
        }
        return this.prisma.user.update({
            data: data,
            where: {
                id
            }
        })
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
            data.password = user.password
        }
        return this.prisma.user.update({
            data: data,
            where: {
                id
            }
        });
    }

    async delete(id: number) {
        await this.validaSeUserExiste(id);
        return this.prisma.user.delete({
            where: {
                id
            }
        });
    }

    async validaSeUserExiste(id: number) {
        const usuarioExiste = await this.prisma.user.count({
            where: {
                id
            }
        });
        if (!usuarioExiste) {
            throw new HttpException('Usuário não encontrado!', HttpStatus.BAD_REQUEST);
        }
    }
}