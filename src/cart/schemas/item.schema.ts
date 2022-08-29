import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ItemDocument = Document & Item;

@Schema()
export class Item {
    @Prop({type: SchemaTypes.ObjectId, ref: 'Product'})
    productID: string;

    @Prop()
    name: string;

    @Prop()
    amount: number;

    @Prop()
    price: number;

    @Prop()
    subTotalPrice: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);