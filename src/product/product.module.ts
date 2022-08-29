import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          schema.plugin(require('mongoose-slug-generator'));
          return schema;
        }
      }
    ]),
    CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  
})
export class ProductModule {}
