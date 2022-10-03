import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { EmailConfirmModule } from '../email-confirm/email-confirm.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/.env'
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10000s' },
    }),
    UserModule, 
    PassportModule, 
    EmailConfirmModule 
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
