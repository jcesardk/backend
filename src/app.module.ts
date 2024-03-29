import {forwardRef, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {ConfigModule} from "@nestjs/config";
import {MailerModule} from "@nestjs-modules/mailer";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "process";
import {UserEntity} from "./user/entities/user.entity";

@Module({
  imports: [
      ConfigModule.forRoot(),
      ThrottlerModule.forRoot({
          ttl: 60,
          limit: 100,
          // ignoreUserAgents: [/googlebot/gi]
      }),
      forwardRef(() => UserModule),
      forwardRef(() => AuthModule),
      MailerModule.forRoot({
          transport: 'smtps://kathryne.dietrich@ethereal.email:nBw8FZbgjV47F2x1Mm@smtp.ethereal.email',
          defaults: {
              from: '"nest-modules" <modules@nestjs.com>',
          },
          template: {
              dir: __dirname + '/templates',
              adapter: new PugAdapter(),
              options: {
                  strict: true,
              },
          },
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: +process.env.MYSQL_PORT,
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          entities: [UserEntity],
          synchronize: process.env.ENV === "dev",
      })
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
  }],
  exports: [AppService]
})
export class AppModule {}
