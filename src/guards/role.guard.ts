import {BadRequestException, CanActivate, ExecutionContext, HttpStatus, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {ROLES_ENUM_KEY} from "../decorators/roles.decorators";
import {RoleEnum} from "../enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext) {

       const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_ENUM_KEY, [context.getHandler(), context.getClass()])

        if (!requiredRoles) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest().access_token;

        console.warn('ROLES', {requiredRoles, user})

        return requiredRoles.length > 0;
    }
}