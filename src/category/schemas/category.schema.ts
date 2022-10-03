import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Document & Category;

@Schema()
export class Category {

    @Prop()
    name : string;

    @Prop({ slug: "name", unique: true, index: true })
    slug : string;

    @Prop()
    banner : string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);


