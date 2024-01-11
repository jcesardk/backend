import {forwardRef, Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";
import {PrismaModule} from "../prima/prisma.module";
import {environments} from "eslint-plugin-prettier";
import * as process from "process";
import {FileModule} from "../file/file.module";

@Module({
    imports: [
        JwtModule.register({
        secret: process.env.JWT_SECRET
        }),
        forwardRef(() => UserModule),
        PrismaModule,
        FileModule
    ],
    exports: [AuthModule, AuthService],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {

}