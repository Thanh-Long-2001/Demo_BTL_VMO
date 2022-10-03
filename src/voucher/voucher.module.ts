import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Voucher.name,
        schema: VoucherSchema
      }
    ])
  ],
  providers: [VoucherService],
  controllers: [VoucherController],
  exports: [VoucherService]
})
export class VoucherModule {}
