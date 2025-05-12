import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist } from '../models/wishlist.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Wishlist,
      Product,
      User
    ])
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService]
})
export class WishlistModule {} 