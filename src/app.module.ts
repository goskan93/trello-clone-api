import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardModule } from './modules/cards/card.module';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://localhost:testestestest@local-env.dwokr44.mongodb.net/trello-clone-api?retryWrites=true&w=majority',
    ),
    CardModule,
    TaskModule,
  ],
})
export class AppModule {}
