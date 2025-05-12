import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../models/order.model';
import { OrderDetail } from '../models/order-detail.model';
import { Product } from '../models/product.model';
import { OrderStatus } from '../models/order-status.model';
import { PaymentMethod } from '../models/payment-method.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      OrderDetail,
      Product,
      OrderStatus,
      PaymentMethod
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {} 