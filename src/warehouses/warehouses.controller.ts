import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from '../models/warehouse.model';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(+id);
  }

  @Get(':id/inventory')
  getInventory(@Param('id') id: string) {
    return this.warehousesService.getInventory(+id);
  }

  @Get(':id/low-stock')
  getLowStockItems(
    @Param('id') id: string,
    @Query('threshold') threshold?: number,
  ) {
    return this.warehousesService.getLowStockItems(+id, threshold);
  }

  @Post()
  create(@Body() createWarehouseDto: Partial<Warehouse>) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: Partial<Warehouse>,
  ) {
    return this.warehousesService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(+id);
  }
} 