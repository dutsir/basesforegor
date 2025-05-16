import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item.model';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll(): Promise<CartItem[]> {
    return this.cartService.findAll();
  }

  @Get('total/:userId')
  getCartTotalWithUserDetails(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.cartService.getCartTotalWithUserDetails(userId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number): Promise<CartItem[]> {
    return this.cartService.findByUser(userId);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: number): Promise<CartItem[]> {
    return this.cartService.findByProduct(productId);
  }

  @Post()
  create(@Body() cartItemData: Partial<CartItem>): Promise<CartItem> {
    return this.cartService.create(cartItemData);
  }

  @Post('add')
  addToCart(
    @Body('userId') userId: number,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number = 1,
  ): Promise<CartItem> {
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Put('update')
  updateQuantity(
    @Body('userId') userId: number,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ): Promise<CartItem> {
    return this.cartService.updateQuantity(userId, productId, quantity);
  }

  @Delete('remove')
  removeFromCart(
    @Body('userId') userId: number,
    @Body('productId') productId: number,
  ): Promise<number> {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<CartItem> {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() cartItemData: Partial<CartItem>,
  ): Promise<[number, CartItem[]]> {
    return this.cartService.update(id, cartItemData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<number> {
    return this.cartService.remove(id);
  }

  @Get('summary/:userId')
  getCartSummary(@Param('userId') userId: string) {
    return this.cartService.getCartSummary(+userId);
  }
} 