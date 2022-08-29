import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CategoryDTO } from './dtos/category.dto';
import * as fs from 'fs';


@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

    async createCategory(categoryDto: CategoryDTO, banner: any): Promise<Category> {
        const newCategory = await (await this.categoryModel.create(categoryDto)).updateOne({banner: banner});
        return newCategory;      
    }

    async findAll(): Promise<Category[]> {
        const categories = await this.categoryModel.find().exec();
        return categories;
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        return category;
    }

    async findOneBySlug(slug: string): Promise<Category> {
        const category = await this.categoryModel.findOne({slug}).exec();
        return category;
    }

    async updateOne(id: string, file: any, categoryDto: CategoryDTO): Promise<any> {
        const category = await this.categoryModel.findById(id).exec();
        const path = category.banner;
        console.log(path);
        if(path){
            fs.unlinkSync(path);
        }
        console.log(path)
        category.updateOne(categoryDto).exec();
        category.updateOne({banner: file}).exec();
        return category;
    }

    async deleteOne(id: string): Promise<any> {
        const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
        return deletedCategory;
    }

}
