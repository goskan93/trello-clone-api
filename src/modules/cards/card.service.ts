import { Injectable } from '@nestjs/common';
import { CardInput } from 'src/contracts/inputs/CardInput';
import { CardOutput } from 'src/contracts/outputs/CardOutput';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './dto/card.schema';
import { Model } from 'mongoose';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async getAllByUserId(userId: string): Promise<CardOutput[]> {
    const cards = await this.cardModel.find({ user: userId }); //.populate('user');
    const mappedCards = cards.map(
      (c) => new CardOutput(c.name, c._id.toString()),
    );
    return mappedCards;
  }

  async findById(userId: string, cardId: string): Promise<CardOutput> {
    const card = await this.cardModel.findById(cardId);
    if (card && card.user.toString() === userId) {
      return new CardOutput(card.name, card._id.toString());
    }
    return null;
  }

  async delete(userId: string, cardId: string) {
    await this.cardModel.deleteOne({ _id: cardId, user: userId });
  }

  async create(userId: string, card: CardInput): Promise<string> {
    const newCard = new this.cardModel({
      name: card.name,
      user: userId,
    });
    const savedCard = await newCard.save();
    return savedCard._id.toString();
  }
}
