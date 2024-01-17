import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {LogInterceptor} from "./interceptors/log.interceptor";
import * as nodemailer from 'nodemailer';
import * as process from "process";
import * as moment from "moment";

moment.locale('pt-br');
export const transporter = nodemailer.createTransport({
  service: 'google',
  host: 'smtp.gmail.com',
  port: 587,
  ignoreTLS: false,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

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
