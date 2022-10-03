import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { VoucherModule } from './voucher/voucher.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FlashsaleModule } from './flashsale/flashsale.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { EmailConfirmModule } from './email-confirm/email-confirm.module';
import * as Joi from '@hapi/joi'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/hello'),
    ScheduleModule.forRoot(),
    //confirm email
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
      })
    }), 
    
    //
    ProductModule, 
    UserModule, 
    AuthModule, 
    CartModule, 
    CategoryModule, 
    VoucherModule, 
    FlashsaleModule, 
    EmailModule, 
    EmailConfirmModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
