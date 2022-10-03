import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDTO {
    @ApiProperty()
    newPassword: string;
    @ApiProperty()
    confirmPassword: string;
}