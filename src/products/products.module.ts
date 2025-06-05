import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../models/product.model';
import { OrderDetail } from '../models/order-detail.model';
import { Order } from '../models/order.model';
import { Inventory } from '../models/inventory.model';
import { Warehouse } from '../models/warehouse.model';
import { Review } from '../models/review.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Product,
      OrderDetail,
      Order,
      Inventory,
      Warehouse,
      Review
    ])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {} 