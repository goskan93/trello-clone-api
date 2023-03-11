import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Task } from './task.schema';

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
  @Prop({ required: true })
  name: string;
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }] })
  tasks: Task[];
}

export const CardSchema = SchemaFactory.createForClass(Card);
