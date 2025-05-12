import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from '../models/inventory.model';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(+productId);
  }

  @Get('warehouse/:warehouseId')
  findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.findByWarehouse(+warehouseId);
  }

  @Get('low-stock')
  getLowStockItems(@Query('threshold') threshold?: number) {
    return this.inventoryService.getLowStockItems(threshold);
  }

  @Post()
  create(@Body() createInventoryDto: Partial<Inventory>) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: Partial<Inventory>,
  ) {
    return this.inventoryService.update(+id, updateInventoryDto);
  }

  @Patch('stock/:productId/:warehouseId')
  updateStock(
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.updateStock(+productId, +warehouseId, quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
} 