import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from '../models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, type: [Category], description: 'Список категорий успешно получен' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID категории' })
  @ApiResponse({ status: 200, type: Category, description: 'Категория успешно найдена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получить товары по категории' })
  @ApiParam({ name: 'id', type: Number, description: 'ID категории' })
  @ApiResponse({ status: 200, type: [Category], description: 'Товары категории успешно получены' }) // Note: This should ideally return Products, not Category itself.
  @Get(':id/products')
  getCategoryWithProducts(@Param('id') id: string) {
    return this.categoriesService.getCategoryWithProducts(+id);
  }

  @ApiOperation({ summary: 'Создать новую категорию' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, type: Category, description: 'Категория успешно создана' })
  @Post()
  create(@Body() newCategory: Partial<Category>) {
    return this.categoriesService.create(newCategory);
  }

  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiParam({ name: 'id', type: Number, description: 'ID категории' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, type: Category, description: 'Категория успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedCategory: Partial<Category>) {
    return this.categoriesService.update(+id, updatedCategory);
  }

  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiParam({ name: 'id', type: Number, description: 'ID категории' })
  @ApiResponse({ status: 200, description: 'Категория успешно удалена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
} 