import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {LogInterceptor} from "./interceptors/log.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Solicitacao que vira de dominio externo permitido apenas dentro do cors
  app.enableCors({
    origin: ['google.com.br']
  });
  app.useGlobalPipes(new ValidationPipe());
  // Interceptador global
  app.useGlobalInterceptors(new LogInterceptor());
  await app.listen(3000);
}
bootstrap();
