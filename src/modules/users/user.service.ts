import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './dto/user.schema';
import { Model } from 'mongoose';
import { UserOutput } from 'src/contracts/outputs/UserOutput';
import { UserInput } from 'src/contracts/inputs/UserInput';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(username: string, password: string): Promise<string> {
    const newUser = new this.userModel({
      username,
      password,
    });
    const savedUser = await newUser.save();
    return savedUser._id.toString();
  }

  async findByUsername(username: string): Promise<UserOutput | null> {
    const user = await this.userModel.findOne({ username });
    if (user) {
      return new UserOutput(user.username, user.password, user._id.toString());
    }
    return null;
  }
}
