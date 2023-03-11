import {
  Controller,
  Get,
  HttpCode,
  Param,
  Res,
  Post,
  Body,
  Delete,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { CardOutput } from 'src/contracts/outputs/CardOutput';
import { CardService } from './card.service';
import { Response } from 'express';
import { CardInput } from 'src/contracts/inputs/CardInput';

@Controller('api/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @HttpCode(200)
  async getAll(): Promise<CardOutput[]> {
    try {
      return this.cardService.getAll();
    } catch (error) {
      throw new InternalServerErrorException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error,
        },
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CardOutput> {
    const task = await this.cardService.findById(id);
    if (task) {
      res.status(HttpStatus.OK);
      return task;
    }

    res.status(HttpStatus.NOT_FOUND);
    return {} as CardOutput;
  }

  @Post()
  async create(@Body() card: CardInput): Promise<string> {
    const newCardId = await this.cardService.create(card);
    console.log('saved', newCardId);
    return newCardId;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.cardService.delete(id);
  }
}
