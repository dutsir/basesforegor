import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItem } from '../models/cart-item.model';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get()
  findAll() {
    return this.cartItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemsService.findOne(+id);
  }

  @Get('user/:userId')
  getUserCart(@Param('userId') userId: string) {
    return this.cartItemsService.getUserCart(+userId);
  }

  @Post()
  create(@Body() newItem: Partial<CartItem>) {
    return this.cartItemsService.create(newItem);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedItem: Partial<CartItem>) {
    return this.cartItemsService.update(+id, updatedItem);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemsService.remove(+id);
  }

  @Patch(':id/quantity/:quantity')
  updateQuantity(
    @Param('id') id: string,
    @Param('quantity') quantity: string,
  ) {
    return this.cartItemsService.updateQuantity(+id, +quantity);
  }

  @Delete('user/:userId/clear')
  clearUserCart(@Param('userId') userId: string) {
    return this.cartItemsService.clearUserCart(+userId);
  }
} 