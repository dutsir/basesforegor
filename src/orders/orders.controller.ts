import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../models/order.model';
import { OrderDetail } from '../models/order-detail.model';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('user/:userId')
  getOrdersWithProductsByUser(@Param('userId') userId: string) {
    return this.ordersService.getOrdersWithProductsByUser(+userId);
  }

  @Post()
  createOrder(@Body() newOrder: Partial<Order>) {
    return this.ordersService.createOrder(newOrder);
  }

  @Patch(':orderId/status/:statusId')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Param('statusId') statusId: string,
  ) {
    return this.ordersService.updateOrderStatus(+orderId, +statusId);
  }

  @Post('detail')
  addOrderDetail(@Body() newDetail: Partial<OrderDetail>) {
    return this.ordersService.addOrderDetail(newDetail);
  }

  @Get(':orderId/details')
  getOrderDetails(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderDetails(+orderId);
  }
} 