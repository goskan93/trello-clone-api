import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Card } from '../../cards/dto/card.schema';
import { User } from 'src/modules/users/dto/user.schema';
export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Card' })
  card: Card;
  @Prop({ required: true })
  index: number;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
