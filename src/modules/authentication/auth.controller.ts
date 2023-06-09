import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInput, AuthOutput } from '@goskan93/trello-clone-contracts';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() userInput: UserInput): Promise<AuthOutput> {
    return await this.authService.signIn(userInput);
  }
  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() userInput: UserInput): Promise<void> {
    await this.authService.signUp(userInput);
  }
}
