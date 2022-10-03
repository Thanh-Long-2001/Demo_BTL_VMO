import { ApiProperty } from "@nestjs/swagger";

export class ProductDTO {
    @ApiProperty()
    name: string;
    slug: string;
    description: string;

    price: number;
    soluong: number;
    image: string;
    qrcode: string;
    category: any;

}