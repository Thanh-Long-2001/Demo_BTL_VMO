import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoucherDocument = Document & Voucher;

@Schema()
export class Voucher {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    code: string;

    @Prop()
    decreaseMoney: number;

    @Prop()
    useforproductCost: number;

    @Prop()
    numberOfVoucher: number;

    @Prop()
    expireAt: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);