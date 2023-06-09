import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/modules/users/dto/user.schema';

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const CardSchema = SchemaFactory.createForClass(Card);
