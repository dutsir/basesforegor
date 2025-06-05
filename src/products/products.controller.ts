import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { InventoryStatsDto } from './dto/inventory-stats.dto';
import { SalesAndInventoryStatsResult } from './dto/sales-and-inventory-stats-result.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Получить аналитику товаров' })
  @ApiResponse({ 
    status: 200, 
    description: 'Аналитика товаров успешно получена',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          product_id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Смартфон' },
          total_orders: { type: 'number', example: 15 },
          total_sold: { type: 'number', example: 45 },
          total_revenue: { type: 'number', example: 150000 },
          avg_order_quantity: { type: 'number', example: 3 },
          total_reviews: { type: 'number', example: 8 },
          avg_rating: { type: 'number', example: 4.5 },
          current_stock: { type: 'number', example: 20 }
        }
      }
    }
  })
  @Get('analytics')
  getProductAnalytics() {
    return this.productsService.getProductAnalytics();
  }

  @ApiOperation({ summary: 'Получить статистику продаж и запасов' })
  @ApiQuery({ name: 'months', required: false, type: Number, description: 'Количество месяцев для анализа (по умолчанию 6)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество товаров для отображения (по умолчанию 10)' })
  @ApiResponse({ status: 200, type: [SalesAndInventoryStatsResult], description: 'Статистика продаж и запасов успешно получена' })
  @Get('sales-statistics')
  getSalesAndInventoryStats(
    @Query('months') months?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.getSalesAndInventoryStats(months, limit);
  }

  @ApiOperation({ summary: 'Получить все товары' })
  @ApiResponse({ status: 200, type: [ProductResponseDto], description: 'Список товаров успешно получен' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Получить популярные товары' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество товаров для отображения' })
  @ApiResponse({ status: 200, type: [ProductResponseDto], description: 'Популярные товары успешно получены' })
  @Get('popular')
  getPopularProducts(@Query('limit') limit?: number) {
    return this.productsService.getPopularProducts(limit);
  }

  @ApiOperation({ summary: 'Получить товары по категории' })
  @ApiParam({ name: 'categoryId', type: Number, description: 'ID категории' })
  @ApiResponse({ status: 200, type: [ProductResponseDto], description: 'Товары категории успешно получены' })
  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(+categoryId);
  }

  @ApiOperation({ summary: 'Получить доступные товары' })
  @ApiResponse({ status: 200, type: [ProductResponseDto], description: 'Доступные товары успешно получены' })
  @Get('available')
  findAvailable() {
    return this.productsService.findAvailable();
  }

  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, type: ProductResponseDto, description: 'Товар успешно найден' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: ProductResponseDto, description: 'Товар успешно создан' })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto as Partial<Product>);
  }

  @ApiOperation({ summary: 'Обновить товар' })
  @ApiParam({ name: 'id', type: Number, description: 'ID товара' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, type: ProductResponseDto, description: 'Товар успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto as Partial<Product>);
  }

  @ApiOperation({ summary: 'Удалить товар' })
  @ApiParam({ name: 'id', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, description: 'Товар успешно удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @ApiOperation({ summary: 'Получить статистику по складам' })
  @ApiResponse({ status: 200, type: [InventoryStatsDto], description: 'Статистика по складам успешно получена' })
  @Get('inventory/stats')
  getProductInventoryStats() {
    return this.productsService.getProductInventoryStats();
  }
} 