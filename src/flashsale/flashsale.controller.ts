import { Controller, Post, Get, Request, Body, Delete, UseGuards, Param } from '@nestjs/common';
import { FlashSaleService } from './flashsale.service';
import { ProductSaleDTO } from './dtos/productSale.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FlashSale')
@Controller('flashsale')
export class FlashsaleController {
    constructor( private flashSaleService: FlashSaleService, private userService: UserService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    @Get('/')
    async getListSale(@Request() req) {
        const role = req.user.role;
        
        
        const listSale = await this.flashSaleService.getListSale(role[0]);
        return listSale;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('')
    async addProductToListSale(@Request() req, @Body() productSaleDto: ProductSaleDTO) {
        const role = req.user.role;
        const listSale = await this.flashSaleService.addProductToListSale(role[0],productSaleDto)
        return listSale;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('')
    async removeItemFromListSale(@Request() req, @Body() productID: string) {
        const role = req.user.role;
        
        const listSale = await this.flashSaleService.removeItemFromListSale(role[0], productID);

        return listSale;
    }

}
