import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    role: Role[];

    @Prop()
    refreshToken: string;

    @Prop()
    refreshTokenExp: string;
}

export const UserSchema = SchemaFactory.createForClass(User);