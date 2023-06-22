import {
  Controller,
  Get,
  HttpCode,
  Req,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserOutput } from '@goskan93/trello-clone-contracts';
import { AuthGuard, RequestWithUser } from '../authentication/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {
  constructor() {}
  @Get()
  @HttpCode(200)
  getById(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): UserOutput {
    if (req._user) {
      const { username, id } = req._user;
      res.status(HttpStatus.OK);
      return {
        id,
        username,
      };
    }

    res.status(HttpStatus.NOT_FOUND);
    return {} as UserOutput;
  }
}
