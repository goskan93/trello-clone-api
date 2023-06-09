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
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { CardOutput } from 'src/contracts/outputs/CardOutput';
import { CardService } from './card.service';
import { Response } from 'express';
import { CardInput } from 'src/contracts/inputs/CardInput';
import { AuthGuard } from '../authentication/auth.guard';
import { RequiredPermissions } from '../authentication/permissions.decorator';
import { PERMISSIONS } from '../authentication/permissions';
import { PermissionGuard } from '../authentication/permissions.guard';

@UseGuards(AuthGuard, PermissionGuard)
@Controller('api/users/:userId/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @HttpCode(200)
  @RequiredPermissions(PERMISSIONS.CARD_GET)
  async getAllByUserId(@Param('userId') userId: string): Promise<CardOutput[]> {
    try {
      const cards = await this.cardService.getAllByUserId(userId);
      return cards;
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

  @Get(':cardId')
  async getById(
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CardOutput> {
    const card = await this.cardService.findById(userId, cardId);
    if (card) {
      res.status(HttpStatus.OK);
      return card;
    }

    res.status(HttpStatus.NOT_FOUND);
    return {} as CardOutput;
  }

  @Post()
  async create(
    @Param('userId') userId: string,
    @Body() card: CardInput,
  ): Promise<string> {
    const newCardId = await this.cardService.create(userId, card);
    return newCardId;
  }

  @Delete(':cardId')
  async delete(
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ) {
    await this.cardService.delete(userId, cardId);
  }
}
