import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListProductSale, ListProductSaleDocument } from './schemas/listProductsale.schema';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { ProductSaleDTO } from './dtos/productSale.dto';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../email/email.service'


@Injectable()
export class FlashSaleService {

    constructor(@InjectModel('ProductFlashSale') 
        private readonly listProductSaleModel: Model<ListProductSaleDocument>, 
        private productService: ProductService, 
        private userService: UserService,
        private emailService: EmailService,
    ) {}

    async createListSale( 
        productSaleDto: ProductSaleDTO, 
        name: string, 
        originalPrice: number, 
        saledPrice: number
        ): Promise<ListProductSale> {
        
        const listSale = await this.listProductSaleModel.create({
            
            listProductsale: [
                {
                    ...productSaleDto,
                    name,
                    originalPrice,
                    saledPrice
                }
            ]
        });

        return listSale;
    } 

    async getListSale(role: string): Promise<ListProductSaleDocument> {
        
        const currentDate = new Date();
        const dateOfMonth = currentDate.getDate()
        if(dateOfMonth == 9 && role == 'user' || role == 'admin'){
            return await this.listProductSaleModel.findOne();
            
        }

        
    }

    async addProductToListSale(role: string, productSaleDto: ProductSaleDTO): Promise<ListProductSale> {
        
        const { productId, soluongSale, percentSale } = productSaleDto;
        const product = await this.productService.findOne(productId);
        let soLuongKho = product.soluong;
        const listSale = await this.getListSale(role);
        const saledPrice = ((100-percentSale)*product.price)/100;

        soLuongKho = soLuongKho - soluongSale;
        await this.productService.updateProductByElement(productId, {soluong: soLuongKho});

            if(listSale) {
                const productIndex = listSale.listProductsale.findIndex(product => product.productId === productId);

                await this.productService.updateProductByElement(productId, {soluong: soLuongKho});

                if(productIndex > -1 ) {
                    let product = listSale.listProductsale[productIndex];
                    product.soluongSale = Number(product.soluongSale) + Number(soluongSale);
                    listSale.listProductsale[productIndex] = product;
                    
                    return listSale.save();
                } else {
                    listSale.listProductsale.push({
                        ...productSaleDto,
                        name: product.name,
                        originalPrice: product.price,
                        saledPrice,
                    })

                    return listSale.save();
                }

            } else {
                return await this.createListSale(
                    productSaleDto, 
                    product.name, 
                    product.price,
                    saledPrice)
            }
    }

    async removeItemFromListSale(role: string, productID: string): Promise<any> {
        
        const listSale = await this.getListSale(role);
        const productId = Object.values(productID)   
        const itemIndex = listSale.listProductsale.findIndex(item => item.productId === productId.toString());

        if(itemIndex > -1) {
            listSale.listProductsale.splice(itemIndex, 1);
            return listSale.save();
        }
    }

    async updateProductFlashSale(role: string, productInStore: number, productID: string) {
        const listSale = await this.getListSale(role);
        const products = listSale.listProductsale;
        
        for(let i = 0; i < products.length; i++) {
                if(products[i].productId === productID) {
                    products[i].soluongSale = productInStore;
                    await this.listProductSaleModel.updateOne({listProductsale: products})   
                }
        }

    }

    @Cron('10 0 0 16 * *')
    async rollbackProductSaleToStore() {
        const currentDate = new Date();
        const dateOfMonth = currentDate.getDate()
        
        if(dateOfMonth == 16){
            const listSale = await this.listProductSaleModel.findOne();
            let restProductsSale = listSale.listProductsale;
            
            for(let i = 0; i < restProductsSale.length; i++) {
                if(restProductsSale[i].soluongSale > 0) {
                    const soluongSale = restProductsSale[i].soluongSale;
                    const productId = restProductsSale[i].productId;
                    const product = await this.productService.findOne(productId);
                    product.soluong += soluongSale;

                    await this.productService.reUpdateProduct(productId, product.soluong);
                }
            }
            restProductsSale = [];
            await this.listProductSaleModel.updateOne({listProductsale: restProductsSale});
        }
    }

    @Cron('0 45 23 15 * *' )
    // @Cron('15 * * * * *')
    async notification() {
        
        const users = await this.userService.findAllUser();
        let mailUsers = [];
        let subject = 'FlashSale'
        let text = 'Đợt sale trong tháng sắp tới. Nhanh tay vào săn sale nào các bạn'
        for(let i = 0; i < users.length; i++) {
            mailUsers.push(users[i].email);
        }
        await this.emailService.sendMail({
            to: mailUsers,
            subject,
            text
        })
        console.log('send success')
    }
}
