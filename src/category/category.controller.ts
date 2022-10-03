import { Controller, Get, Param, Post, Put, Body, Delete, UploadedFile, UseInterceptors, Bind, UseGuards } from '@nestjs/common';
import { Category } from './schemas/category.schema';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dtos/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { diskStorage} from 'multer';
import * as path from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            slug: { type: 'name'},
            file: {
            type: 'string',
            format: 'binary',
            },
        },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
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
        console.log(file)
        const linkFile = file.path;
        return await this.categoryService.createCategory(categoryDto, linkFile);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/')
    async findAllCategory(): Promise<Category[]> {
        return await this.categoryService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/:id')
    async findOneCategory(@Param('id') id: string) {
        return await this.categoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('findBySlug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return await this.categoryService.findOneBySlug(slug);
    }

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id')
    async deletedCategory(@Param('id') id: string) {
        return await this.categoryService.deleteOne(id);
    }
    
}
