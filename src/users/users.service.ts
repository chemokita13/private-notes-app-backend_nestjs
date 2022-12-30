import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './users.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') // users collection
    private readonly userModel: Model<User>,
  ) {}
  async getUsers(): Promise<string> {
    console.log(await this.userModel.find({}));
    return 'getting users';
  }
}
