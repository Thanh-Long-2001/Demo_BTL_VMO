import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDTO } from './dtos/item.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<CartDocument>) {}

    async createCart(userId: string, itemDto: ItemDTO, subTotalPrice: number, totalPrice: number): Promise<Cart> {
        const newCart = await this.cartModel.create({
            userId,
            items: [{...itemDto, subTotalPrice}],
            totalPrice,
        });

        return newCart;
    }

    async getCart(userId: string): Promise<CartDocument> {
        const cart = await this.cartModel.findOne({userId});
        return cart;
    }

    async deleteCart(userId: string): Promise<Cart> {
        const deletedCart = await this.cartModel.findOneAndRemove({userId});
        return deletedCart;
    }

    private calculateCart(cart: CartDocument) {
        cart.totalPrice = 0;
        cart.items.forEach((item) => {
            cart.totalPrice += item.amount*item.price;
        });
    }

    async addItemToCart(userId: string, itemDto: ItemDTO): Promise<Cart>{
        const { productID, amount, price } = itemDto;
        const subTotalPrice = amount * price;
        const cart = await this.getCart(userId);

        if(cart) {
            const itemIndex = cart.items.findIndex(item => item.productID === productID);

            if(itemIndex > -1) {
                let item = cart.items[itemIndex];
                item.amount = Number(item.amount) + Number(amount);
                item.subTotalPrice = item.amount * item.price;

                cart.items[itemIndex] = item;
                this.calculateCart(cart);
                return cart.save();
            } else {
                cart.items.push({ ...itemDto, subTotalPrice });
                this.calculateCart(cart);
                return cart.save();
              }
        } else {
            const newCart = await this.createCart(userId, itemDto, subTotalPrice, price);
            return newCart;
          }
    }

    async removeItemFromCart(userId: string, productID: any): Promise<Cart> {
        const cart = await this.getCart(userId);
        const productId = Object.values(productID);
        const itemIndex = cart.items.findIndex(item => item.productID === productId.toString());
        console.log(itemIndex);
        if (itemIndex > -1) {
          cart.items.splice(itemIndex, 1);
          return cart.save();
        }
    }

}
