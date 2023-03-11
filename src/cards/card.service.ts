import { Injectable } from '@nestjs/common';
import { CardInput } from 'src/contracts/inputs/CardInput';
import { CardOutput } from 'src/contracts/outputs/CardOutput';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from '../dto/card.schema';
import { Model } from 'mongoose';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async getAll(): Promise<CardOutput[]> {
    return await this.cardModel.find();
  }

  async findById(id: string): Promise<CardOutput> {
    return await this.cardModel.findById(id);
  }

  async delete(id: string) {
    await this.cardModel.deleteOne({ _id: id });
  }

  async create(card: CardInput): Promise<string> {
    const newCard = new this.cardModel(card);
    const savedCard = await newCard.save();
    return savedCard._id.toString();
  }
}
