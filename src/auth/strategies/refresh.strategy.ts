// import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Request } from 'express';
// import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
// import {} from 'dotenv/config';

// @Injectable()
// export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
//     constructor(private userService: UserService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
//                 let data = request?.cookies['auth-cookie'];
//                 if(!data) {
//                     return null;
//                 }
//                 return data.accessToken;
//             }]),
//             ignoreExpiration: false,
//             // passReqToCallback: true,
//             secretOrKey: process.env.REFRESH_TOKEN_SECRET,
//         });
//     }

    // async validate(req: Request, payload: any) {
    //     if(!payload) {
    //         throw new BadRequestException('Invalid jwt token');
    //     }

    //     let data = req?.cookies['auth-cookie'];
    //     console.log(data);
    //     if(!data?.refreshToken) {
    //         throw new BadRequestException('Invalid refresh token')
    //     }

    //     let user = await this.userService.validRefreshToken(payload.email, data.refreshToken);
    //     if(!user) {
    //         throw new BadRequestException('Token expired')
    //     }

    //     return payload;
    // }
// }


import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import {} from 'dotenv/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        let data = request?.cookies['auth-cookie'];
                if(!data){
                    return null;
                }
                return data.accessToken;
      }]),
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.REFRESHTOKEN_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    if(!payload) {
        throw new BadRequestException('Invalid jwt token');
    }
    // console.log(payload);

    let data = req?.cookies['auth-cookie'];
    // console.log(data);
    if(!data?.refreshToken) {
        throw new BadRequestException('Invalid refresh token')
    }

    let user = await this.userService.validRefreshToken(payload.mail, data.refreshToken);
    
    if(!user) {
        throw new BadRequestException('Token expired')
    }

    return payload;
  }
}
