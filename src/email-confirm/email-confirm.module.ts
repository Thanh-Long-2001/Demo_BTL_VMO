import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module'
import { EmailConfirmService } from './email-confirm.service';
import { UserModule } from 'src/user/user.module';
import { EmailConfirmController } from './email-confirm.controller';


@Module({
    imports: [
        ConfigModule,
        UserModule,
        JwtModule,
        EmailModule,
    ],
    providers: [EmailConfirmService],
    controllers: [EmailConfirmController],
    exports: [EmailConfirmService]
})
export class EmailConfirmModule {}
