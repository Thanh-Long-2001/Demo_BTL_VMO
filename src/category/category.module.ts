import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema, Category } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([ 
      {
        name: Category.name,
        useFactory: () => {
          const slug = require('mongoose-slug-generator')
          const schema = CategorySchema;
          schema.plugin(slug)
          return schema;
        },
      }
    ])
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
