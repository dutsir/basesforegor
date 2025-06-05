import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from '../models/warehouse.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @ApiOperation({ summary: 'Получить все склады' })
  @ApiResponse({ status: 200, type: [Warehouse], description: 'Список складов успешно получен' })
  @Get()
  findAll() {
    return this.warehousesService.findAll();
  }

  @ApiOperation({ summary: 'Получить склад по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID склада' })
  @ApiResponse({ status: 200, type: Warehouse, description: 'Склад успешно найден' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получить инвентарь склада' })
  @ApiParam({ name: 'id', type: Number, description: 'ID склада' })
  @ApiResponse({ status: 200, description: 'Инвентарь склада успешно получен' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  @Get(':id/inventory')
  getInventory(@Param('id') id: string) {
    return this.warehousesService.getInventory(+id);
  }

  @ApiOperation({ summary: 'Получить товары с низким запасом на складе' })
  @ApiParam({ name: 'id', type: Number, description: 'ID склада' })
  @ApiQuery({ name: 'threshold', required: false, type: Number, description: 'Порог низкого запаса' })
  @ApiResponse({ status: 200, description: 'Список товаров с низким запасом успешно получен' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  @Get(':id/low-stock')
  getLowStockItems(
    @Param('id') id: string,
    @Query('threshold') threshold?: number,
  ) {
    return this.warehousesService.getLowStockItems(+id, threshold);
  }

  @ApiOperation({ summary: 'Создать новый склад' })
  @ApiBody({ type: Warehouse })
  @ApiResponse({ status: 201, type: Warehouse, description: 'Склад успешно создан' })
  @Post()
  create(@Body() createWarehouseDto: Partial<Warehouse>) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @ApiOperation({ summary: 'Обновить склад' })
  @ApiParam({ name: 'id', type: Number, description: 'ID склада' })
  @ApiBody({ type: Warehouse })
  @ApiResponse({ status: 200, type: [Warehouse], description: 'Склад успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: Partial<Warehouse>,
  ) {
    return this.warehousesService.update(+id, updateWarehouseDto);
  }

  @ApiOperation({ summary: 'Удалить склад' })
  @ApiParam({ name: 'id', type: Number, description: 'ID склада' })
  @ApiResponse({ status: 200, description: 'Склад успешно удален' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(+id);
  }
} 