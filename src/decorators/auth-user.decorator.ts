import {createParamDecorator, ExecutionContext, HttpException, HttpStatus} from "@nestjs/common";

export const AuthUser = createParamDecorator((filter: string, context: ExecutionContext) => {

    const request = context.switchToHttp().getRequest();

    if (request.access_token.user) {
        if (filter) {
            return request.access_token.user[filter];
        } else {
            return request.access_token.user;
        }
    } else {
        throw new HttpException('Usuário não encontrado no Request. Use o AuthGuard para obter o usuário!', HttpStatus.NOT_FOUND);
    }
})