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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { PaginateDto } from 'src/dtos/paginate-sort.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('store/product')
export class ProductController {
    constructor(private productService: ProductService) {};

    @Get('/api/products')
    async getAllProducts(@Query() filterProductDto: FilterProductDTO, @Body() paginateDto: PaginateDto) {
        console.log(filterProductDto);
        if(Object.keys(filterProductDto).length) {
            const filteredProducts = await this.productService.getFilteredProducts(filterProductDto, paginateDto);
            return filteredProducts;
        } else {
            const allProducts = await this.productService.findAll(paginateDto);
            return allProducts;
        }
    }
    
    @Post()
    async createProduct(@Body(new ValidationPipe()) productDto: ProductDTO) {
        return await this.productService.createProduct(productDto)
    }

    @Get()
    async findAll(@Body() paginateDto: PaginateDto) {
        return await this.productService.findAll(paginateDto);
    }

    @Get('productsByCategory/:category')
    async findAllbyCategory(@Param('category') category: string, @Body() paginateDto: PaginateDto) {
        return await this.productService.findAllbyCategory(category, paginateDto);
    }

    @Get('productsByCategorySlug/:category')
    async findAllbyCategorySlug(@Param('category') category: string, @Body() paginateDto: PaginateDto) {
        return await this.productService.findAllbyCategorySlug(category, paginateDto);
    }

    @Get('/:id')
    async findOne(@Param('id') id: string) {
      return await this.productService.findOne(id);
    }

    @Get('productBySlug/:slug')
    async findOneBySlug(@Param('slug') slug: string) {
        return await this.productService.findOneBySlug(slug);
    }

    @Put('/:id')
    async updateProduct(@Param('id') id: string, @Body() productDto: ProductDTO) {
        return await this.productService.updateProduct(id, productDto);
    }

    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteOne(id);
    }
}
