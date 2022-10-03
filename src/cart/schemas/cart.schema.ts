import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Item } from './item.schema';

export type CartDocument = Document & Cart;

@Schema()
export class Cart {
    @Prop({type: SchemaTypes.ObjectId, ref: 'User'})
    userID: string;

    @Prop()
    items: Item[];

    @Prop()
    totalPrice: number;

    @Prop()
    appliedVoucher: any[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
