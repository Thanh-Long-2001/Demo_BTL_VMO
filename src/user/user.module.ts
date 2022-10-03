import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { VoucherModule } from 'src/voucher/voucher.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    VoucherModule,
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
