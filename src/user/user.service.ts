import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as randomToken from 'rand-token';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(@InjectModel('User')  private readonly userModel: Model<UserDocument>) { }

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = await this.userModel.create(createUserDTO);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return newUser.save();
  }

  async findUser(username: string): Promise<User> {
    const user = await this.userModel.findOne({username: username});
    return user;
  }

  async getRefreshToken(userId: any): Promise<string> {
    console.log(userId)
    var expiresIn = new Date();
    const userDataToUpdate = {
        refreshToken: randomToken.generate(16),
        refreshTokenExp: expiresIn.setDate(expiresIn.getDate() + 1),
      };

    await this.userModel.findByIdAndUpdate(userId, userDataToUpdate);
    return userDataToUpdate.refreshToken;
  }

  async validRefreshToken(mail: string, refreshToken: string): Promise<User> {
    
    let user = await this.userModel.findOne({mail, refreshToken});

    if(!user) {
      return null;
    }
    
    if( new Date() > new Date((await user).refreshTokenExp)) {
      return null
    }
    
    return user;
  }

}