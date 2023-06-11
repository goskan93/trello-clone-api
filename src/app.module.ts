import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardModule } from './modules/cards/card.module';
import { TaskModule } from './modules/tasks/task.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/authentication/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.env.NODE_ENV}.env`],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    CardModule,
    TaskModule,
    UserModule,
    AuthModule,
    TestModule,
  ],
})
export class AppModule {}
