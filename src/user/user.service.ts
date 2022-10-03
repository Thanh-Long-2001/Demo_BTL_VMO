import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as randomToken from 'rand-token';
import { VoucherService } from 'src/voucher/voucher.service';
import { AddVoucher } from './dtos/addVoucher.dto';


@Injectable()
export class UserService {
  constructor(@InjectModel('User')  
  private readonly userModel: Model<UserDocument>, 
  private voucherService: VoucherService,
  ) { }

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = await this.userModel.create(createUserDTO);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return newUser.save();
  }

  async addVoucherToUser(idUser: string, idVoucher: AddVoucher) : Promise<any> {
    const voucher = await this.voucherService.fineOneVoucher(idVoucher.id);
    const findUser = await this.userModel.findById(idUser);
    const date = new Date();
    
    let  { name, description, code, decreaseMoney, useforproductCost, expireAt } = voucher;
    name = voucher.name;
    description = voucher.description;
    code = voucher.code;
    decreaseMoney = voucher.decreaseMoney;
    useforproductCost = voucher.useforproductCost;
    expireAt = voucher.expireAt;
    
    const expireAtDate = new Date(expireAt)
    if(date <= expireAtDate) {
      findUser.vouchers.push({ name, description, code, decreaseMoney, useforproductCost, expireAt });
      await this.userModel.findByIdAndUpdate(idUser, findUser);
      const numberOfVoucherExist = voucher.numberOfVoucher - 1;
      await this.voucherService.updateVoucherAfterGetVoucherToUser(idVoucher.id, numberOfVoucherExist);
    } else {
      return 'Expired Voucher'
    }
    
  }

  async findUser(username: string): Promise<User> {
    const user = await this.userModel.findOne({username: username});
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({email: email});
    return user;
  }

  async markEmailAsConfirmed(reupdateEmail: string): Promise<any> {
    const user = await this.findByEmail(reupdateEmail);
    
    user.isConfirmEmail = true;
    user.email = reupdateEmail;
    await user.save();
  }

  async validRefreshToken(email: string, refreshToken: string): Promise<User> {
    
    let user = await this.userModel.findOne({email, refreshToken});
    
    if(!user) {
      return null;
    }
    
    if( new Date() > new Date((await user).refreshTokenExp)) {
      
      return null
    }
    
    return user;
  }

  async findUserById(id: string) : Promise<User> {
    return this.userModel.findById(id);
  }

  async updateUser(id: string, vouchers: any): Promise<any> {
    return this.userModel.findByIdAndUpdate(id, vouchers)
  }

  async findAllUser(): Promise<User[]> {
    return this.userModel.find()
  }

}