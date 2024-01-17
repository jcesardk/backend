import {forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {UserControllers} from "./user.controllers";
import {UserService} from "./user.service";
import {UserIdCheckMiddleware} from "../middlewares/user-id-check.middleware";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ]),
        forwardRef(() => AuthModule)
    ],
    controllers: [UserControllers],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(UserIdCheckMiddleware).forRoutes({
            path: 'user/:id',
            method: RequestMethod.ALL
        });
    }
}