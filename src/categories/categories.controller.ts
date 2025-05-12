import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '../models/category.model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Get(':id/products')
  getCategoryWithProducts(@Param('id') id: string) {
    return this.categoriesService.getCategoryWithProducts(+id);
  }

  @Post()
  create(@Body() newCategory: Partial<Category>) {
    return this.categoriesService.create(newCategory);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedCategory: Partial<Category>) {
    return this.categoriesService.update(+id, updatedCategory);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
} 