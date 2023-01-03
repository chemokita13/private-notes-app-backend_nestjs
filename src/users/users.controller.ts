import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.interface';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { serialize } from 'Cookie';
import { UserDTO } from './userDTO';
@Controller('users')
export class UsersController {
  private readonly jwt_Secret = process.env.SECRET || 'hard_secret';
  constructor(private readonly usersService: UsersService) {}

  //* This method cant be able in prod mode (only for debug)
  @Get('/get')
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }
  @Post('/new')
  createUser(@Req() request: Request): Promise<User> {
    return this.usersService.createUser(request.body);
  }
  @Post('/auth')
  async authUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const returner: {
        code: number;
        msg: string;
        user: UserDTO;
      } = await this.usersService.authUser(request.body);

      if (returner.code !== 201) {
        return response.status(returner.code).json(returner);
      }
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1, // valid for 1 day
          user: returner.user._id,
        },
        this.jwt_Secret,
      );
      const serializedToken = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        //? sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
        path: '/',
      });
      response.setHeader('Set-Cookie', serializedToken);
      response.status(returner.code).json(returner);
    } catch (error) {
      response.status(500).json({
        code: 500,
        msg: 'internal server error; something wen wrong, please try again',
      });
    }
  }
  @Delete('/delete')
  async deleteUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const { token } = request.cookies;
      const { user } = jwt.verify(token, this.jwt_Secret);
      const deletedUser: {
        code: number;
        msg: string;
        user?: UserDTO;
      } = await this.usersService.deleteUser(user);
      response.status(deletedUser.code);
      return response.json(deletedUser);
    } catch (error) {
      response.status(500).json({
        code: 500,
        msg: 'internal server error; something wen wrong, please try again',
      });
    }
  }
}
