import {forwardRef, Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";
import * as process from "process";
import {FileModule} from "../file/file.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";

@Module({
    imports: [
        JwtModule.register({
            secret: String(process.env.JWT_SECRETO),
        }),
        forwardRef(() => UserModule),
        FileModule,
        TypeOrmModule.forFeature([
            UserEntity
        ]),
    ],
    exports: [AuthModule, AuthService],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {

}