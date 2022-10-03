import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ProductSaleDocument = Document & ProductSale;

@Schema()
export class ProductSale {
    @Prop({type: SchemaTypes.ObjectId, ref: 'Product'})
    productId: string;

    @Prop()
    name: string;
    
    @Prop()
    soluongSale: number;

    @Prop()
    originalPrice: number;

    @Prop()
    percentSale: number;

    @Prop()
    saledPrice: number;
}

export const ProductSaleSchema = SchemaFactory.createForClass(ProductSale);