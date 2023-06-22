import { Injectable } from '@nestjs/common';
import { CardInput, CardOutput } from '@goskan93/trello-clone-contracts';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './dto/card.schema';
import { Model } from 'mongoose';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async getAllByUserId(userId: string): Promise<CardOutput[]> {
    const cards = await this.cardModel.find({ user: userId }); //.populate('user');
    const mappedCards: CardOutput[] = cards.map((c) => ({
      id: c._id.toString(),
      name: c.name,
    }));
    return mappedCards;
  }

  async findById(userId: string, cardId: string): Promise<CardOutput> {
    const card = await this.cardModel.findById(cardId);
    if (card && card.user.toString() === userId) {
      return {
        id: card._id.toString(),
        name: card.name,
      } as CardOutput;
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
