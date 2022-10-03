import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from '../cart/schemas/cart.schema';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { FlashsaleModule } from 'src/flashsale/flashsale.module';

@Module({
  imports: [
    MongooseModule.forFeature([ {name: 'Cart', schema: CartSchema}]),
    ProductModule,
    UserModule,
    FlashsaleModule
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
