import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Получить все элементы корзины' })
  @ApiResponse({ status: 200, type: [CartItem], description: 'Список элементов корзины успешно получен' })
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

  @ApiOperation({ summary: 'Получить корзину пользователя' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, type: [CartItem], description: 'Корзина пользователя успешно получена' })
  @Get('user/:userId')
  findByUser(@Param('userId') userId: number): Promise<CartItem[]> {
    return this.cartService.findByUser(userId);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: number): Promise<CartItem[]> {
    return this.cartService.findByProduct(productId);
  }

  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiBody({ type: CartItem })
  @ApiResponse({ status: 201, type: CartItem, description: 'Товар успешно добавлен в корзину' })
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

  @ApiOperation({ summary: 'Обновить количество товара в корзине' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID товара' })
  @ApiBody({ schema: { type: 'object', properties: { quantity: { type: 'number' } } } })
  @ApiResponse({ status: 200, type: CartItem, description: 'Количество товара в корзине успешно обновлено' })
  @ApiResponse({ status: 404, description: 'Элемент корзины не найден' })
  @Patch('user/:userId/product/:productId')
  updateQuantity(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<CartItem> {
    return this.cartService.updateQuantity(userId, productId, quantity);
  }

  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiParam({ name: 'id', type: Number, description: 'ID элемента корзины' })
  @ApiResponse({ status: 200, description: 'Товар из корзины успешно удален' })
  @ApiResponse({ status: 404, description: 'Элемент корзины не найден' })
  @Delete(':id')
  remove(@Param('id') id: number): Promise<number> {
    return this.cartService.remove(id);
  }

  @ApiOperation({ summary: 'Удалить товар пользователя из корзины' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, description: 'Товар пользователя из корзины успешно удален' })
  @ApiResponse({ status: 404, description: 'Элемент корзины не найден' })
  @Delete('user/:userId/product/:productId')
  removeUserProduct(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ): Promise<number> {
    return this.cartService.removeUserProduct(userId, productId);
  }

  @ApiOperation({ summary: 'Очистить корзину пользователя' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Корзина пользователя успешно очищена' })
  @Patch('user/:userId/clear')
  clearUserCart(@Param('userId') userId: number): Promise<number> {
    return this.cartService.clearUserCart(userId);
  }

  @Get('summary/:userId')
  getCartSummary(@Param('userId') userId: string) {
    return this.cartService.getCartSummary(+userId);
  }
} 