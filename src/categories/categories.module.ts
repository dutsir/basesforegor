import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Category,
      Product
    ])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {} 