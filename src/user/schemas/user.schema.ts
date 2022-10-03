import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { Voucher } from 'src/voucher/schemas/voucher.schema'

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    username: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    password: string;

    @Prop()
    role: Role[];

    @Prop()
    refreshToken: string;

    @Prop()
    refreshTokenExp: string;

    @Prop()
    vouchers: any[];

    @Prop({default: false})
    isConfirmEmail: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);