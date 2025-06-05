import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../models/order.model';
import { OrderDetail } from '../models/order-detail.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Получить заказы пользователя' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Заказы пользователя успешно получены' })
  @Get('user/:userId')
  getOrdersWithProductsByUser(@Param('userId') userId: string) {
    return this.ordersService.getOrdersWithProductsByUser(+userId);
  }

  @ApiOperation({ summary: 'Создать новый заказ' })
  @ApiBody({ type: Order })
  @ApiResponse({ status: 201, type: Order, description: 'Заказ успешно создан' })
  @Post()
  createOrder(@Body() newOrder: Partial<Order>) {
    return this.ordersService.createOrder(newOrder);
  }

  @ApiOperation({ summary: 'Обновить статус заказа' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID заказа' })
  @ApiParam({ name: 'statusId', type: Number, description: 'ID статуса' })
  @ApiResponse({ status: 200, description: 'Статус заказа успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @Patch(':orderId/status/:statusId')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Param('statusId') statusId: string,
  ) {
    return this.ordersService.updateOrderStatus(+orderId, +statusId);
  }

  @ApiOperation({ summary: 'Добавить товар в заказ' })
  @ApiBody({ type: OrderDetail })
  @ApiResponse({ status: 201, type: OrderDetail, description: 'Товар успешно добавлен в заказ' })
  @Post('detail')
  addOrderDetail(@Body() newDetail: Partial<OrderDetail>) {
    return this.ordersService.addOrderDetail(newDetail);
  }

  @ApiOperation({ summary: 'Получить детали заказа' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID заказа' })
  @ApiResponse({ status: 200, type: [OrderDetail], description: 'Детали заказа успешно получены' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @Get(':orderId/details')
  getOrderDetails(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderDetails(+orderId);
  }
} 