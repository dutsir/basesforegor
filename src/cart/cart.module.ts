import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from '../models/cart-item.model';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [SequelizeModule.forFeature([CartItem, User, Product])],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {} 