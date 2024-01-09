import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";
import {PrismaModule} from "../prima/prisma.module";

@Module({
    imports: [
        JwtModule.register({
        secret: '(x!rm#lk)QFMgUz`,BN[}>`?wMAD6Eu|&qjMkEmv'
        }),
        UserModule,
        PrismaModule
    ],
    exports: [AuthModule, AuthService],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {

}