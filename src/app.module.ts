import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/hello'), ProductModule, UserModule, AuthModule, CartModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
