import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
    
    username: string;

    email: string;

    
    password: string;

    role: string[];
}