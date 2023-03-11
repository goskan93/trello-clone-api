import { Module } from '@nestjs/common';
import { TaskController } from './tasks/task.controller';
import { CardController } from './cards/card.controller';
import { TaskService } from './tasks/task.service';
import { CardService } from './cards/card.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './dto/task.schema';
import { Card, CardSchema } from './dto/card.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://localhost:testestestest@local-env.dwokr44.mongodb.net/trello-clone-api?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [TaskController, CardController],
  providers: [TaskService, CardService],
})
export class AppModule {}
