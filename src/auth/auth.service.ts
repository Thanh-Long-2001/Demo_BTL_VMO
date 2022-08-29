import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findUser(username);
        const isPasswordMatch = bcrypt.compare(password, user.password)
        
        if(user && isPasswordMatch) {
            return user;
        }

        return null;
    }

    async getJwtToken(user: any) {
        const payload = { 
            userId: user._id,
            username: user.username,
            email: user.email, 
            role: user.role,
            refreshToken: user.refreshToken,
            refreshTokenExp: user.refreshTokenExp,
        };

        return this.jwtService.signAsync(payload)
      
    }
    
}
