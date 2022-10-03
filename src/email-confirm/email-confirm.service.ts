import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerificationTokenPayload } from './verificationTokenPayload.interface';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailConfirmService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly userService: UserService
      ) {}
     
    public sendVerificationLink(email: string) {
        const payload: VerificationTokenPayload = { email };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
        });
     
        const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/email-confirm/${token}`;
     
        const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
     
        return this.emailService.sendMail({
          to: email,
          subject: 'Email confirmation',
          text,
        })
    }

    public sendLinkChangePassword(email: string) {
      const payload: VerificationTokenPayload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
      });
   
      const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/auth/change-password/${token}`;
      const text = `To change your password, Please click here: ${url}`;
   
      return this.emailService.sendMail({
        to: email,
        subject: 'Forget password',
        text,
      })
  }

    async confirmEmail(email: string) {
        const user = await this.userService.findByEmail(email);
        
        if (user.isConfirmEmail) {
          throw new BadRequestException('Email already confirmed');
        }
        await this.userService.markEmailAsConfirmed(email);
      }

    async decodeConfirmationToken(token) {
        try {
            const payload = await this.jwtService.verify(token, {
              secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
            });
       
            if (typeof payload === 'object' && 'email' in payload) {
              return payload.email;
            }

            throw new BadRequestException();
          } catch (error) {

            if (error?.name === 'TokenExpiredError') {
              throw new BadRequestException('Email confirmation token expired');
            }

            throw new BadRequestException('Bad confirmation token');
          }
    }
}
