import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
// import { PaginateDto } from '../dtos/paginate-sort.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { CategoryService } from '../category/category.service';
import { Cron, CronExpression } from '@nestjs/schedule';
var LocalStorage = require('node-localstorage').LocalStorage;
import * as QRCode from 'qrcode';
    
@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) 
        private productModel: Model<ProductDocument>,  
        private categoryService: CategoryService,
        ) {}
    
    async createProduct(productDto: ProductDTO, image: any): Promise<Product> {
        const newproduct = new this.productModel(productDto);
        const { name, description, price } = productDto;
        console.log(name, description, price);
        let qr = await QRCode.toString(price);
        console.log(qr);
        newproduct.qrcode = qr;
        newproduct.image = image;
        return newproduct.save();
    }

    async updateProduct(id: string, productDto: ProductDTO): Promise<Product> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, {...productDto}).exec();
        return updatedProduct;
    }

    async updateProductByElement(id: string, element: any): Promise<Product> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, element);
        return updatedProduct;
    }


    async findAll(pageNumber: string, sortNumber: string): Promise<any> {
        const count: number = await this.productModel.countDocuments().exec();
        const page_size = 3;
        let totalPages: number;
        if(count % page_size == 0 ) {
            totalPages = count / page_size;
        } else {
            totalPages = count / page_size + 1;
        }
        totalPages = Math.round(totalPages);
        

        let arrayPages = [];
        for( let i = 1; i <= totalPages; i++ ) {
            arrayPages.push(i);
        }
        
        let pageNumber1 = parseInt(pageNumber);
        let allPagesToString = count.toString();
        let skip: number;
        
        var localStorage = new LocalStorage('./scratch');
        localStorage.setItem('currentPage', pageNumber);
        localStorage.setItem('allPages', allPagesToString);
        localStorage.setItem('category', "undefined")
        localStorage.removeItem('sortNumber');
        if(arrayPages.includes(pageNumber1)) {
            skip = pageNumber1 - 1;
            let sortNumber1;
            if(typeof sortNumber === 'string') {
                sortNumber1 = parseInt(sortNumber);
                localStorage.setItem('sortNumber', sortNumber)
                const docs: Product[] = await this.productModel.find().skip(skip*page_size).limit(page_size).sort({price: sortNumber1});    
                return { count, docs };
            } else {
                const docs: Product[] = await this.productModel.find().skip(skip*page_size).limit(page_size);    
                return { count, docs };
            }
        } 
    }

    async findNext(): Promise<any> {
        
        var localStorage = new LocalStorage('./scratch');
        let currentPage = localStorage.getItem('currentPage');
        let allPages = localStorage.getItem('allPages');
        let category: any = localStorage.getItem('category');
        let sortNumber: any = localStorage.getItem('sortNumber');

        const count: number = parseInt(allPages);
        const page_size = 3;
        
        let totalPages: number;
        if(count % page_size == 0 ) {
            totalPages = count / page_size;
        } else {
            totalPages = count / page_size + 1;
        }
        totalPages = Math.round(totalPages)
        let arrayPages = [];
        for( let i = 1; i <= totalPages; i++ ) {
            arrayPages.push(i);
        }
        
        let skip: number;     
        let newPage = parseInt(currentPage) 
        let nextPage = (newPage + 1).toString()
        localStorage.setItem('currentPage', nextPage);

        if(currentPage) {
            if(arrayPages.includes(newPage)) {
                skip = newPage;
                let sortNumber1;
                if(typeof sortNumber === 'string') {
                    sortNumber1 = parseInt(sortNumber);
                    if(category ==='undefined') {  
                        const docs: Product[] = await this.productModel.find().skip(skip*page_size).limit(page_size).sort({price: sortNumber1});
                        return { count, docs }
                    } else if(category !== 'undefined') {
                        
                        const docs: Product[] = await this.productModel.find({category}).skip(skip*page_size).limit(page_size).sort({price: sortNumber1}); 
                        return { count, docs };
                    }
                } else {

                    if(category ==='undefined') {  
                        const docs: Product[] = await this.productModel.find().skip(skip*page_size).limit(page_size);
                        return { count, docs }
                    } else if(category !== 'undefined') {
                        const docs: Product[] = await this.productModel.find({category}).skip(skip*page_size).limit(page_size);   
                        return { count, docs };
                    }
                }
            } 
        } 
  
    }

    async findPreview(): Promise<any> {
        var localStorage = new LocalStorage('./scratch');
        let currentPage = localStorage.getItem('currentPage');
        const count: number = localStorage.getItem('allPages');
        let category: any = localStorage.getItem('category');
        let sortNumber: any = localStorage.getItem('sortNumber');
        
        const page_size = 3;
        
        let totalPages: number;
        if(count % page_size == 0 ) {
            totalPages = count / page_size;
        } else {
            totalPages = count / page_size + 1;
        }
        totalPages = Math.round(totalPages)
        

        let arrayPages = [];
        for( let i = 1; i <= totalPages; i++ ) {
            arrayPages.push(i);
        }
        
        let skip: number;     
        let newPage = parseInt(currentPage) 
        let nextPage = (newPage - 1).toString()
        localStorage.setItem('currentPage', nextPage);
        
        if(currentPage) {
            
            if(arrayPages.includes(newPage)) {
                skip = newPage - 2;
                if(skip >= 0) {
                    let sortNumber1;
                    if(typeof sortNumber === 'string') {
                        sortNumber1 = parseInt(sortNumber);
                        if(category ==='undefined') {  
                            const docs: Product[] = await this.productModel.find().skip(skip*page_size).limit(page_size).sort({price: sortNumber1});
                            return { count, docs }
                        } else if(category !== 'undefined') {
                            
                            const docs: Product[] = await this.productModel.find({category}).skip(skip*page_size).limit(page_size).sort({price: sortNumber1}); 
                            return { count, docs };
                        }
                    } else {

                        if(category ==='undefined') {  
                            const docs: Product[] = await this.productModel.find().skip(skip*page_size).limit(page_size);
                            return { count, docs }
                        } else if(category !== 'undefined') {
                            const docs: Product[] = await this.productModel.find({category}).skip(skip*page_size).limit(page_size);   
                            return { count, docs };
                        }
                    }
                }
            } 
        } 
    }

    

    async findAllbyCategory(category: any, pageNumber: string, sortNumber: string): Promise<any> {
        const count: number = await this.productModel.countDocuments({category}).exec();
        const page_size = 3;
        let totalPages: number;
        if(count % page_size == 0 ) {
            totalPages = count / page_size;
        } else {
            totalPages = count / page_size + 1;
        }
        totalPages = Math.round(totalPages)
        

        let arrayPages = [];
        for( let i = 1; i <= totalPages; i++ ) {
            arrayPages.push(i);
        }
        let allPagesToString = count.toString();
        var localStorage = new LocalStorage('./scratch');
        localStorage.setItem('currentPage', pageNumber);
        localStorage.setItem('allPages', allPagesToString);
        localStorage.setItem('category', category);
        localStorage.setItem('sortNumber', sortNumber);
        let pageNumber1 = parseInt(pageNumber);
        let sortNumber1;
        if(sortNumber) {
            sortNumber1 = parseInt(sortNumber);
        }
        console.log(sortNumber1);
        let skip: number;
        if(arrayPages.includes(pageNumber1)) {
            skip = pageNumber1 - 1;
            let sortNumber1;
            if(typeof sortNumber === 'string') {
                sortNumber1 = parseInt(sortNumber);
                const docs: Product[] = await this.productModel.find({category}).skip(skip*page_size).limit(page_size).sort({price: sortNumber1});
                
                return { count, docs };
            } else {
                const docs: Product[] = await this.productModel.find({category}).skip(skip*page_size).limit(page_size);
                return { count, docs }
            }
        }
        
    }

    async findAllbyCategorySlug(category: any): Promise<any> {
        const findOneCategory: any = await this.categoryService.findOneBySlug(category);
        const count: number = await this.productModel.countDocuments({category: findOneCategory._id}).exec();
        const page_size = 3;
        const docs: Product[] = await this.productModel.find({category: findOneCategory._id});
        return { count, docs };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        return product;
    }

    async findOneBySlug(slug: string): Promise<Product> {
        const product = await this.productModel.findOne({slug}).exec();
        return product;
    }

    async deleteOne(id: string): Promise<any> {
        return await this.productModel.deleteOne({_id: id}).exec();
    }

    // Search Product
    async getFilteredProducts(key: string): Promise<Product[]> {
        
        // const { name, slug } = 
        const page_size = 3;
        // clean filter, use reg trim special character
        const filter: {[key: string]: any} = {};
        if(key) {
            filter.$or = [
                {
                    name: new RegExp( key, 'i')
                },
                {
                    slug: new RegExp( key, 'i')
                }
            ]
        }

        
        return await this.productModel.find(filter);
    }

    async updateProductAfterPayment(id: string, amount: number): Promise<Product> {
        
        const product = await this.productModel.findByIdAndUpdate(id, {soluong: amount}).exec();
        return product;
    }

    async reUpdateProduct(id: string, restProductsSale: number): Promise<any> {
        return await this.productModel.findByIdAndUpdate(id, {soluong: restProductsSale}).exec();
    }
}
