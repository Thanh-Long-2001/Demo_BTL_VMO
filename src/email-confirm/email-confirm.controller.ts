import { Controller, Post, Body, Req, Param, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfirmEmailDto } from './dtos/confirmEmail.dto';
import { EmailConfirmService } from './email-confirm.service';

@ApiTags('Confirm Email')
@Controller('email-confirm')
export class EmailConfirmController {
    constructor(private readonly emailConfirmService: EmailConfirmService) {}

    @Get('/:token')
    async confirm(@Param('token') token: string) {
        const email = await this.emailConfirmService.decodeConfirmationToken(token);
        await this.emailConfirmService.confirmEmail(email);
    }

}
