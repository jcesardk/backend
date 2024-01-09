import {CallHandler, ExecutionContext, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

export class LogInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        const dtInit = Date.now();

        return next.handle().pipe(tap(() => {
            const request = context.switchToHttp().getRequest();
            console.warn(`Url: ${request.url}`)
            console.warn(`Execução levou ${Date.now() - dtInit} milisegundos`)
        }));
    }

}