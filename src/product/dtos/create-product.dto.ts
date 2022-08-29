import { IsNotEmpty, IsMongoId } from 'class-validator';

export class ProductDTO {

    @IsNotEmpty()
    name: string;
    slug: string;
    description: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @IsMongoId() //used to check if input value is ObjectId type
    category: any;

}