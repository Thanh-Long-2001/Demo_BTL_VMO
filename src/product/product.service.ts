import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { PaginateDto } from '../dtos/paginate-sort.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { CategoryService } from '../category/category.service';



@Injectable()
export class ProductService {

    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>,  private categoryService: CategoryService) {}
    
    async createProduct(productDto: ProductDTO): Promise<Product> {
        const newproduct = new this.productModel(productDto);
        return newproduct.save();
    }

    async updateProduct(id: string, productDto: ProductDTO): Promise<Product> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, {...productDto}, {useFindAndModify: false}).exec();
        return updatedProduct;
    }

    async findAll(paginateDto: PaginateDto): Promise<any> {
        const count: number = await this.productModel.countDocuments().exec();
        const page_size = 3;
        const docs: Product[] = await this.productModel.find().skip(paginateDto.skip*page_size).limit(paginateDto.limit).sort({[paginateDto.sortBy]: paginateDto.sortOrder}).exec();      
        return { count, docs };
    }

    async findAllbyCategory(category: any, paginateDto: PaginateDto): Promise<any> {
        const count: number = await this.productModel.countDocuments({category}).exec();
        const page_size = 3;
        const docs: Product[] = await this.productModel.find({category}).skip(paginateDto.skip*page_size).limit(paginateDto.limit).sort({[paginateDto.sortBy]: paginateDto.sortOrder}).exec();
        return { count, docs };
    }

    async findAllbyCategorySlug(category: any, paginateDto: PaginateDto): Promise<any> {
        const findOneCategory: any = await this.categoryService.findOneBySlug(category);
        const count: number = await this.productModel.countDocuments({category: findOneCategory._id}).exec();
        const page_size = 3;
        const docs: Product[] = await this.productModel.find({category: findOneCategory._id}).skip(paginateDto.skip*page_size).limit(paginateDto.limit).sort({[paginateDto.sortBy]: paginateDto.sortOrder}).exec();
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

    //Filter Product 
    async getFilteredProducts(filterProductDto: FilterProductDTO, paginateDto: PaginateDto): Promise<Product[]> {
        
        const { category, search } = filterProductDto;
        const page_size = 3;
        // clean filter, use reg trim special character
        const filter: {[key: string]: any} = {};
        if (search) {
            filter.$or = [
                {
                    name: new RegExp( search, 'i')
                },
                {
                    description: new RegExp( search, 'i')
                },
            ]
        }

        if (category) {
            filter.category = new RegExp( category, 'i');
        }

        return await this.productModel.find(filter).skip(paginateDto.skip*page_size).limit(paginateDto.limit).sort({[paginateDto.sortBy]: paginateDto.sortOrder}).exec();
    }
}
