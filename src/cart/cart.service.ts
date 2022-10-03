import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDTO } from './dtos/item.dto';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { FlashSaleService } from 'src/flashsale/flashsale.service';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') 
        private readonly cartModel: Model<CartDocument>, 
        private productService: ProductService,
        private userService: UserService,
        private flashSaleService: FlashSaleService
    ) {}

    async createCart(
        userId: string, 
        itemDto: ItemDTO, 
        name: string, 
        price: number, 
        subTotalPrice: number, 
        totalPrice: number
        ): Promise<Cart> {
            
        const newCart = await this.cartModel.create({
            userID: userId,
            items: [
                        {...itemDto, 
                            name,
                            price,
                            subTotalPrice,
                        }
                    ],
            totalPrice,
        });
        return newCart;
    }

    async getCart(userId: string): Promise<CartDocument> {
        const cart = await this.cartModel.findOne({userID: userId});
        return cart;
    }

    async deleteCart(userId: string): Promise<Cart> {
        const deletedCart = await this.cartModel.findOneAndRemove({userId});
        return deletedCart;
    }

    private calculateCart(cart: CartDocument) {
        cart.totalPrice = 0
        cart.items.forEach((item) => 
            cart.totalPrice += (item.amount * item.price)
        );
        
    }

    async addItemToCart(userId: string, itemDto: ItemDTO, role: string): Promise<Cart>{

        const { productID, amount } = itemDto;
        const product = await this.productService.findOne(productID);
       
        const cart = await this.getCart(userId);
        
        
        //ProductSale
        console.log(role)
        let listSale = await this.flashSaleService.getListSale(role);
        let productSale;
        let subTotalPrice = 0;
        let productIndex;
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
                if(productSale) {
                    cart.items.push(
                        {    
                            name: productSale.name,
                            ...itemDto,
                            price: productSale.saledPrice, 
                            subTotalPrice 
                        });
    
                    this.calculateCart(cart);
                    return cart.save();
                } else {
                    cart.items.push(
                        {    
                            name: product.name,
                            ...itemDto,
                            price: product.price, 
                            subTotalPrice 
                        });
                    
                    this.calculateCart(cart);
                    return cart.save();
                }
            }
        } else {

            if(productSale) {
                 await this.createCart(userId, itemDto, productSale.name, productSale.saledPrice, subTotalPrice, amount*productSale.saledPrice)
            }else
                 await this.createCart(userId, itemDto, product.name, product.price, subTotalPrice, amount*product.price);
            
        }
        
        let items = cart.items;
        if(listSale) {
            productIndex = listSale.listProductsale.findIndex(itemSale => itemSale.productId === productID);
            
            productSale = listSale.listProductsale[productIndex];
           
            for(let i = 0; i < items.length; i++) {
                if(productIndex > -1) {

                    
                        items[i].price = productSale.saledPrice;
                        items[i].subTotalPrice = items[i].price*items[i].amount;
                        await cart.save();
                    
                } else {
                    items[i].price = product.price
                    items[i].subTotalPrice = items[i].amount * product.price;
                    await cart.save();
                }
            }
            
        } else {
            for(let i = 0; i < items.length; i++) {
                items[i].price = product.price
                items[i].subTotalPrice = items[i].amount * product.price;
                await cart.save();
            }
        }
        
        
    }

    async removeItemFromCart(userId: string, productID: any): Promise<Cart> {
        const cart = await this.getCart(userId);
        const productId = Object.values(productID);
        const totalPrice = cart.totalPrice;
        const itemIndex = cart.items.findIndex(item => item.productID === productId.toString());

        cart.totalPrice = totalPrice - cart.items[itemIndex].price * cart.items[itemIndex].amount;
        if (itemIndex > -1) {
          cart.items.splice(itemIndex, 1);
          return cart.save();
        }
    }

    async applyVoucher(userId: string, codeVoucher: any, role: string): Promise<Cart> {
        
        const listSale = await this.flashSaleService.getListSale(role);
        const productsSale = listSale.listProductsale;

        const cart = await this.getCart(userId);
        const products = cart.items;

        let notSaleProduct = [];
        let saledProduct = [];

        for( let i = 0; i < products.length; i++ ) {
            if(productsSale.length > 0) {

                for( let j = 0; j < productsSale.length; j++ ) {
                    if(products[i].productID !== productsSale[j].productId) {            
                        notSaleProduct.push(products[i]);
                    } else if (products[i].productID === productsSale[j].productId) {
                        saledProduct.push(products[i]);
                    }
                }
            } else {
                saledProduct.push(products[i]);
            }
        }
        
        const user = await this.userService.findUserById(userId);
        const vouchers = user.vouchers;
        const code = codeVoucher.code
        const voucher = vouchers.find((voucher) => {
            const expireAt = voucher.expireAt;
            const date = new Date();
            const expireAtDate = new Date(expireAt);
            if(voucher.code === code && date <= expireAtDate ) {
                return voucher;
            } else if(voucher.code !== code) {
                return 'Bad Code'
            } else {
                return 'Expired voucher'
            }
        });

        let totalPriceOfProductNotSale = 0;
        for(let i = 0; i < notSaleProduct.length; i++) {
            totalPriceOfProductNotSale += notSaleProduct[i].subTotalPrice;
        }
        
        let totalPriceOfProductSaled = 0;
        for(let i = 0; i < saledProduct.length; i++) {
            totalPriceOfProductSaled += saledProduct[i].subTotalPrice;
        }

        const appliedVoucherTotalPriceOfProductNotSale = totalPriceOfProductNotSale - voucher.decreaseMoney;
        const cartId = cart.id;
        
        cart.appliedVoucher.push(voucher)
        cart.totalPrice = appliedVoucherTotalPriceOfProductNotSale + totalPriceOfProductSaled
        
        
        await this.cartModel.findByIdAndUpdate(cartId, cart);
        const newCart = await this.cartModel.findById(cartId)
        return newCart;
    }

    async payMent(userId: string, role: string): Promise<any> {
        const user = await this.userService.findUserById(userId);
        const cart = await this.getCart(userId);
        const items = [...cart.items];
        const listSale = await this.flashSaleService.getListSale(role);
        console.log(listSale);
        const productsSale = listSale.listProductsale;
        const appliedVoucher = cart.appliedVoucher.find(voucher => voucher.code );
        
        for(let i = 0; i < user.vouchers.length; i++) {
            if(user.vouchers[i].code === appliedVoucher.code) {
                user.vouchers.splice(i, 1)
                await this.userService.updateUser(userId, user)
            }
        }

        for( let i = 0; i < items.length; i++) {
            let productInStore;
            for(let j = 0; j < productsSale.length; j++) {
                if(items[i].productID === productsSale[j].productId) {
                    productInStore = productsSale[j].soluongSale - items[i].amount;
                    await this.flashSaleService.updateProductFlashSale(role, productInStore, items[i].productID);
                } 
            }
            const product = await this.productService.findOne(items[i].productID);
            productInStore = product.soluong - items[i].amount;
            
            await this.productService.updateProductAfterPayment(items[i].productID, productInStore);
        }
    }
}
