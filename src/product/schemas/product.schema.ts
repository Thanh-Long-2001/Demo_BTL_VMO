import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';

export type ProductDocument = Document & Product;

@Schema()
export class Product {
    @Prop({required: true, index: true})
    name: string;

    @Prop()
    description: string;

    @Prop({slug: 'name', unique: true, index: true})
    slug: string;

    @Prop({type: Number, required: true, index: true})
    price: number;

    @Prop()
    image: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true})
    category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);