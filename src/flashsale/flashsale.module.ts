import { Module } from '@nestjs/common';
import { FlashSaleService } from './flashsale.service';
import { FlashsaleController } from './flashsale.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { ListProductSaleSchema } from './schemas/listProductsale.schema'
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'ProductFlashSale',
                schema: ListProductSaleSchema
            }
        ]),
        ProductModule,
        UserModule,
        EmailModule,
    ],
    controllers: [FlashsaleController],
    providers: [FlashSaleService],
    exports: [FlashSaleService]
})
export class FlashsaleModule {}
