import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserInput } from 'src/contracts/inputs/UserInput';
import { userPermissions } from './permissions';

@Injectable()
export class AuthService {
  private saltRounds: number = 10;
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: UserInput): Promise<AuthOutput> {
    const userDb = await this.usersService.findByUsername(user.username);
    console.log(bcrypt);
    const correctPass = await bcrypt.compare(user.password, userDb.password);
    if (!correctPass) {
      throw new UnauthorizedException();
    }
    const payload = {
      username: user.username,
      id: userDb.id,
      sub: userDb.id,
      claims: userPermissions,
    };
    const jwt_token = await this.jwtService.signAsync(payload);

    return {
      access_token: jwt_token,
    };
  }

  async signUp(user: UserInput) {
    const userDb = await this.usersService.findByUsername(user.username);
    if (userDb) {
      throw new UnprocessableEntityException('User already exists.');
    }
    const hashedPass = await bcrypt.hash(user.password, this.saltRounds);
    await this.usersService.create(user.username, hashedPass);
  }

  async resetPassword() {}
}
