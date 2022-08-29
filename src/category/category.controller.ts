import { Controller, Get, Param, Post, Put, Body, Delete, UploadedFile, UseInterceptors, Bind } from '@nestjs/common';
import { Category } from './schemas/category.schema';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dtos/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage} from 'multer';
import * as path from 'path';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('/')
    @UseInterceptors(FileInterceptor ('file', {
        storage: diskStorage({
            destination: 'src/assets/category/banner',
            filename(req, file, callback) {
                const fileName = path.parse(file.originalname).name.replace('/\s/g', '') + Date.now();
                const extension = path.parse(file.originalname).ext;
                callback(null, `${fileName}${extension}`)
            },
        })
    }))
    @Bind(UploadedFile())
    async createCategory( file: any, @Body() categoryDto: CategoryDTO) {
        const linkFile = file.path;
        return await this.categoryService.createCategory(categoryDto, linkFile);
    }

    @Get('/')
    async findAllCategory(): Promise<Category[]> {
        return await this.categoryService.findAll();
    }

    @Get('/:id')
    async findOneCategory(@Param('id') id: string) {
        return await this.categoryService.findOne(id);
    }

    @Get('findBySlug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return await this.categoryService.findOneBySlug(slug);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor ('file', {
        storage: diskStorage({
            destination: 'src/assets/category/banner',
            filename(req, file, callback) {
                const fileName = path.parse(file.originalname).name.replace('/\s/g', '') + Date.now();
                const extension = path.parse(file.originalname).ext;
                callback(null, `${fileName}${extension}`)
            },
        })
    }))
    @Bind(UploadedFile())
    async updateCategory(file: any, @Param('id') id: string, categoryDto: CategoryDTO) {
        console.log(file)
        const linkFile = file.path;
        return await this.categoryService.updateOne(id, linkFile, categoryDto);
    }

    @Delete('/:id')
    async deletedCategory(@Param('id') id: string) {
        return await this.categoryService.deleteOne(id);
    }
    
}
