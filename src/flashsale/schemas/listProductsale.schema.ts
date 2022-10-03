import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ProductSale } from './productsale.schema'

export type ListProductSaleDocument = Document & ListProductSale

@Schema()
export class ListProductSale {
    @Prop({type: SchemaTypes.ObjectId, ref: 'User'})
    userID: string[];

    @Prop()
    listProductsale: ProductSale[];
}

export const ListProductSaleSchema = SchemaFactory.createForClass(ListProductSale)