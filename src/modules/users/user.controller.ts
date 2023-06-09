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
import { UserOutput } from 'src/contracts/outputs/UserOutput';
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
      return new UserOutput(username, id);
    }

    res.status(HttpStatus.NOT_FOUND);
    return {} as UserOutput;
  }
}
