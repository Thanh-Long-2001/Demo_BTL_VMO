import { 
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ValidationPipe,
    Request,
    UseGuards,
    CacheInterceptor,
    UseInterceptors,
    Bind,
    UploadedFile
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
// import { PaginateDto } from 'src/dtos/paginate-sort.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@ApiBearerAuth()
@ApiTags('Product')
@Controller('api/product')
// @UseInterceptors(CacheInterceptor)
export class ProductController {
    constructor(private productService: ProductService) {};

    @ApiParam({
        name: "sortNumber",
        type: String,
        required: false,

    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/findAll/:pageNumber/:sortNumber?')
    async getAllProducts(
        @Param('pageNumber') pageNumber: string,
        @Param('sortNumber') sortNumber?: string) {
        // console.log(filterProductDto);
        // if(Object.keys(filterProductDto).length) {
            // const filteredProducts = await this.productService.getFilteredProducts(filterProductDto, paginateDto);
        //     return filteredProducts;
        // } else {
            
        // }
        return await this.productService.findAll(pageNumber, sortNumber);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/findNext')
    async pressNext() {
        return await this.productService.findNext();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/findPreview')
    async pressPreview() {
        return await this.productService.findPreview();
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string'},
            price: { type: 'number' },
            slug: { type: 'name'},
            file: {
                type: 'string',
                format: 'binary',
            },
            category: {type: 'string'},
            soluong: { type: 'number'},
        },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('/addProduct')
    @UseInterceptors(FileInterceptor ('file', {
        storage: diskStorage({
            destination: 'src/assets/product/images',
            filename(req, file, callback) {
                const fileName = path.parse(file.originalname).name.replace('/\s/g', '') + Date.now();
                const extension = path.parse(file.originalname).ext;
                callback(null, `${fileName}${extension}`)
            },
        })
    }))
    @Bind(UploadedFile())
    async createProduct(file: any, @Body() productDto: ProductDTO) {
        const linkFile = file.path;
        return await this.productService.createProduct(productDto, linkFile);
    }

    @ApiParam({
        name: "sortNumber",
        type: String,
        required: false,

    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('clickCategoryToRenderProduct/:category/:pageNumber/:sortNumber?')
    async findAllbyCategory(
        @Param('category') category: string, 
        @Param('pageNumber') pageNumber: string, 
        @Param('sortNumber') sortNumber?: string) {
        return await this.productService.findAllbyCategory(category, pageNumber, sortNumber);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('searchProductsByNameOfCategory/:category')
    async findAllbyCategorySlug(@Param('category') category: string) {
        return await this.productService.findAllbyCategorySlug(category);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    @Get('/:id')
    async findOne(@Param('id') id: string) {
      return await this.productService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('productBySlug/:slug')
    async findOneBySlug(@Param('slug') slug: string) {
        return await this.productService.findOneBySlug(slug);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('/:id')
    async updateProduct(@Param('id') id: string, @Body() productDto: ProductDTO) {
        return await this.productService.updateProduct(id, productDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteOne(id);
    }

    @ApiQuery(
        {
            name: "key",
            required: false,
            type: String,
        },
    )
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/search/searchBy')
    async searchProduct(@Query('key') key: string) {
        
        return await this.productService.getFilteredProducts(key)
    }
}
