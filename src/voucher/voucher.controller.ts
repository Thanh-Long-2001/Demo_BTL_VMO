import { Controller, Post, Put, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateVoucherDTO } from './dtos/voucher.dto';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Voucher')
@Controller('voucher')
export class VoucherController {
    constructor(private voucherService: VoucherService) {};

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getAllVouchers() {
        return await this.voucherService.findAllVouchers();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async createVoucher(@Body() voucherDto: CreateVoucherDTO) {
        return await this.voucherService.createVoucher(voucherDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('/:id')
    async updateVoucher(@Param() id: string, @Body() voucherDto: CreateVoucherDTO) {
        return await this.voucherService.updateVoucher(id, voucherDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id')
    async deleleVoucher(@Param() id: string) {
        return await this.voucherService.deleleVoucher(id);
    }
}
