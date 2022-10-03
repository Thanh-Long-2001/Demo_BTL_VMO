import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Document & Product;

@Schema()
export class Product {
    @ApiProperty()
    @Prop({required: true, index: true})
    name: string;

    @ApiProperty()
    @Prop()
    description: string;

    @ApiProperty()
    @Prop({slug: 'name', unique: true, index: true})
    slug: string;

    @ApiProperty()
    @Prop({type: Number, required: true, index: true})
    price: number;

    @ApiProperty()
    @Prop()
    image: string;

    @ApiProperty()
    @Prop()
    soluong: number;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true})
    category: Category;

    @Prop({type: String, required: false})
    qrcode: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product);