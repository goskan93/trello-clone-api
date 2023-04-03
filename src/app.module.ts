import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardModule } from './modules/cards/card.module';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [MongooseModule.forRoot(''), CardModule, TaskModule],
})
export class AppModule {}
