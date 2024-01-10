import {CanActivate, ExecutionContext, forwardRef, Inject, Injectable} from "@nestjs/common";
import {AuthService} from "../auth/auth.service";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly userService: UserService
        ) {
    }

    async canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest();

        const { authorization } = request.headers;

        try {
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);

            request.access_token = data;
            // request.user = await this.userService.searchUser(data.id);

            return true;
        } catch (e) {
            return false;
        }
    }
}