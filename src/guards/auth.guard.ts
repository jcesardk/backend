import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly authService: AuthService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();

        const { authorization } = request.headers;
        try {
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);

            request.access_token = data;

            return true;
        } catch (e) {
            return false;
        }
    }
}