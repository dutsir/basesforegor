import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderStatusesService } from './order-statuses.service';
import { OrderStatus } from '../models/order-status.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('order-statuses')
@Controller('order-statuses')
export class OrderStatusesController {
  constructor(private readonly orderStatusesService: OrderStatusesService) {}

  @ApiOperation({ summary: 'Получить все статусы заказов' })
  @ApiResponse({ status: 200, type: [OrderStatus], description: 'Список статусов заказов успешно получен' })
  @Get()
  findAll() {
    return this.orderStatusesService.findAll();
  }

  @ApiOperation({ summary: 'Получить статус заказа по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID статуса заказа' })
  @ApiResponse({ status: 200, type: OrderStatus, description: 'Статус заказа успешно найден' })
  @ApiResponse({ status: 404, description: 'Статус заказа не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderStatusesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получить заказы по статусу' })
  @ApiParam({ name: 'id', type: Number, description: 'ID статуса заказа' })
  @ApiResponse({ status: 200, description: 'Заказы успешно получены по статусу' })
  @Get(':id/orders')
  getOrdersByStatus(@Param('id') id: string) {
    return this.orderStatusesService.getOrdersByStatus(+id);
  }

  @ApiOperation({ summary: 'Создать новый статус заказа' })
  @ApiBody({ type: OrderStatus })
  @ApiResponse({ status: 201, type: OrderStatus, description: 'Статус заказа успешно создан' })
  @Post()
  create(@Body() createOrderStatusDto: Partial<OrderStatus>) {
    return this.orderStatusesService.create(createOrderStatusDto);
  }

  @ApiOperation({ summary: 'Обновить статус заказа' })
  @ApiParam({ name: 'id', type: Number, description: 'ID статуса заказа' })
  @ApiBody({ type: OrderStatus })
  @ApiResponse({ status: 200, type: OrderStatus, description: 'Статус заказа успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Статус заказа не найден' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: Partial<OrderStatus>,
  ) {
    return this.orderStatusesService.update(+id, updateOrderStatusDto);
  }

  @ApiOperation({ summary: 'Удалить статус заказа' })
  @ApiParam({ name: 'id', type: Number, description: 'ID статуса заказа' })
  @ApiResponse({ status: 200, description: 'Статус заказа успешно удален' })
  @ApiResponse({ status: 404, description: 'Статус заказа не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderStatusesService.remove(+id);
  }
} 