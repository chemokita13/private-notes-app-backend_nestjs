import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './userDTO';
const bcrypt = require('bcrypt'); // bcrypt still using module.export or i cant find esm modules :(

@Injectable()
export class UsersService {
  private readonly salt: Number = process.env.SALT
    ? parseInt(process.env.SALT, 10)
    : 10;

  constructor(
    @InjectModel('User') // users collection
    private readonly userModel: Model<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    // returns all users
    return await this.userModel.find({});
  }

  async createUser(newUser: UserDTO): Promise<User> {
    // bcrypt user password
    const hashedPassword: string = await bcrypt.hash(
      newUser.password,
      this.salt,
    );
    const userToSave = await this.userModel.create({
      ...newUser,
      password: hashedPassword,
    });
    return await userToSave.save();
  }

  async authUser(userToAuth: UserDTO): Promise<{
    code: number;
    msg: string;
    user: UserDTO;
  }> {
    try {
      const user = await this.userModel.findOne({
        username: userToAuth.username,
      });

      if (!user) {
        return { code: 400, msg: 'username not found', user: userToAuth };
      }

      const validPassword: Boolean = await bcrypt.compare(
        userToAuth.password,
        user.password,
      );

      if (!validPassword) {
        return { code: 400, msg: 'invalid password', user: userToAuth };
      }

      return { code: 201, msg: 'all OK; cookie saved', user: user }; // returns user instead of userToAuth because if all is good, the cookie is the user._id
    } catch (error) {
      return {
        code: 500,
        msg: 'something went wrong, please try again',
        user: userToAuth,
      };
    }
  }

  async deleteUser(
    userID: string,
  ): Promise<{ code: number; msg: string; user?: UserDTO }> {
    try {
      const user = await this.userModel.findByIdAndDelete(userID);
      return {
        code: 201,
        msg: 'all OK; user deleted',
        user: user, // return example
      };
    } catch (error) {
      return {
        code: 500,
        msg: 'something went wrong',
      };
    }
  }
}
