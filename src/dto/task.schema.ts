import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Card } from './card.schema';
export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Card' })
  card: Card;
  @Prop({ required: true })
  index: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
