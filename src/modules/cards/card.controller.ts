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
import { CardOutput, CardInput } from '@goskan93/trello-clone-contracts';
import { CardService } from './card.service';
import { Response } from 'express';
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
  @RequiredPermissions(PERMISSIONS.CARD_GET)
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
  @RequiredPermissions(PERMISSIONS.CARD_CREATE)
  async create(
    @Param('userId') userId: string,
    @Body() card: CardInput,
  ): Promise<string> {
    const newCardId = await this.cardService.create(userId, card);
    return newCardId;
  }

  @Delete(':cardId')
  @RequiredPermissions(PERMISSIONS.CARD_DELETE)
  async delete(
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ) {
    await this.cardService.delete(userId, cardId);
  }
}
