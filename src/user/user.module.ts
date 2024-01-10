import {forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {UserControllers} from "./user.controllers";
import {UserService} from "./user.service";
import {PrismaModule} from "../prima/prisma.module";
import {UserIdCheckMiddleware} from "../middlewares/user-id-check.middleware";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        PrismaModule,
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