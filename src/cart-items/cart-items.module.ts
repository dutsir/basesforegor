import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CartItem,
      Product,
      User
    ])
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService]
})
export class CartItemsModule {} 