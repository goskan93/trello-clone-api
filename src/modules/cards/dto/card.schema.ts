import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
  id: string;
  @Prop({ required: true })
  name: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
