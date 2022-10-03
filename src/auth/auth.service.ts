import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService, 
        private readonly jwtService: JwtService,

        ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findUser(username);
        const isPasswordMatch = bcrypt.compare(password, user.password);
        if(user && isPasswordMatch) {
            return user;
        }
        return null;
    }

    async getJwtToken(user: any) {
        const payload = { 
            _id: user._id,
            username: user.username,
            email: user.email, 
            role: user.role,
            vouchers: user.vouchers,
        };
        
        return this.jwtService.signAsync(payload)
      
    }

    async getRefreshToken(userId: any, user: any): Promise<string> {
        var expiresIn = new Date();
        const payload = { 
            _id: user._id,
            username: user.username,
            email: user.email, 
            role: user.role,
            vouchers: user.vouchers,
            
        };
        const userDataToUpdate = {
            refreshToken: await this.jwtService.signAsync(payload),
            refreshTokenExp: expiresIn.setDate(expiresIn.getDate() + 3),
          };
    
        await this.userService.updateUser(userId, userDataToUpdate);
        return userDataToUpdate.refreshToken;
    }

    async forgetPassword(email: string): Promise<any> {
        
    }
    
}
