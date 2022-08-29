import { IsNotEmpty } from "class-validator";

export class CategoryDTO {

    @IsNotEmpty()
    name: string;

    slug: string;

    banner: string;

}