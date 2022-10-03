import { Controller,Get, Post, Body, Delete, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ItemDTO } from './dtos/item.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/')
    async getCart(@Request() req) {
        const userId = req.user.userId;
        const cart = await this.cartService.getCart(userId);
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/')
    async addItemToCart(@Request() req, @Body() ItemDto: ItemDTO)  {
        const userId = req.user._id;
        console.log(userId)
        const role = req.user.role;
        const cart = await this.cartService.addItemToCart(userId, ItemDto, role[0]);
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('/')
    async removeItemFromCart(@Request() req, @Body() productID: string) {
        const userId = req.user._id;
        const cart = await this.cartService.removeItemFromCart(userId, productID);
        if (!cart) throw new NotFoundException('Item does not exist');
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('/:id')
    async deleteCart(@Param('id') userId: string) {
        const cart = await this.cartService.deleteCart(userId);
        if (!cart) throw new NotFoundException('Cart does not exist');
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/applyVoucher')
    async applyVoucher(@Request() req, @Body() code: string) {
        const userId = req.user._id;
        const role = req.user.role;
        return await this.cartService.applyVoucher(userId, code, role[0]);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/payment')
    async payment(@Request() req) {
        const userId = req.user._id;
        const role = req.user.role;
        return await this.cartService.payMent(userId, role[0]);
    }
}
