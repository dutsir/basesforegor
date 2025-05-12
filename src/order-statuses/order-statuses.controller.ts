import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderStatusesService } from './order-statuses.service';
import { OrderStatus } from '../models/order-status.model';

@Controller('order-statuses')
export class OrderStatusesController {
  constructor(private readonly orderStatusesService: OrderStatusesService) {}

  @Get()
  findAll() {
    return this.orderStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderStatusesService.findOne(+id);
  }

  @Get(':id/orders')
  getOrdersByStatus(@Param('id') id: string) {
    return this.orderStatusesService.getOrdersByStatus(+id);
  }

  @Post()
  create(@Body() createOrderStatusDto: Partial<OrderStatus>) {
    return this.orderStatusesService.create(createOrderStatusDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: Partial<OrderStatus>,
  ) {
    return this.orderStatusesService.update(+id, updateOrderStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderStatusesService.remove(+id);
  }
} 