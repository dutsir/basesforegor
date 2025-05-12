import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Wishlist } from '../models/wishlist.model';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(+id);
  }

  @Get('user/:userId')
  getUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getUserWishlist(+userId);
  }

  @Post()
  create(@Body() newItem: Partial<Wishlist>) {
    return this.wishlistService.create(newItem);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(+id);
  }

  @Delete('user/:userId/clear')
  clearUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.clearUserWishlist(+userId);
  }

  @Get('check/:userId/:productId')
  isInWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.isInWishlist(+userId, +productId);
  }
} 