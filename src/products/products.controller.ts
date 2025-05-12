import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('sales-statistics')
  getSalesStatistics(@Query('months') months?: number) {
    return this.productsService.getSalesStatistics(months);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('popular')
  getPopularProducts(@Query('limit') limit?: number) {
    return this.productsService.getPopularProducts(limit);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(+categoryId);
  }

  @Get('available')
  findAvailable() {
    return this.productsService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  create(@Body() newProduct: Partial<Product>) {
    return this.productsService.create(newProduct);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedProduct: Partial<Product>) {
    return this.productsService.update(+id, updatedProduct);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Get('inventory/stats')
  getProductInventoryStats() {
    return this.productsService.getProductInventoryStats();
  }
} 