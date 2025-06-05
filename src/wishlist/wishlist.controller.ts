import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Wishlist } from '../models/wishlist.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiOperation({ summary: 'Получить все элементы списка желаний' })
  @ApiResponse({ status: 200, type: [Wishlist], description: 'Список элементов списка желаний успешно получен' })
  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @ApiOperation({ summary: 'Получить элемент списка желаний по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID элемента списка желаний' })
  @ApiResponse({ status: 200, type: Wishlist, description: 'Элемент списка желаний успешно найден' })
  @ApiResponse({ status: 404, description: 'Элемент списка желаний не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получить список желаний пользователя' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, type: [Wishlist], description: 'Список желаний пользователя успешно получен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get('user/:userId')
  getUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getUserWishlist(+userId);
  }

  @ApiOperation({ summary: 'Добавить товар в список желаний' })
  @ApiBody({ type: Wishlist })
  @ApiResponse({ status: 201, type: Wishlist, description: 'Товар успешно добавлен в список желаний' })
  @Post()
  create(@Body() newItem: Partial<Wishlist>) {
    return this.wishlistService.create(newItem);
  }

  @ApiOperation({ summary: 'Удалить товар из списка желаний' })
  @ApiParam({ name: 'id', type: Number, description: 'ID элемента списка желаний' })
  @ApiResponse({ status: 200, description: 'Товар из списка желаний успешно удален' })
  @ApiResponse({ status: 404, description: 'Элемент списка желаний не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(+id);
  }

  @ApiOperation({ summary: 'Очистить список желаний пользователя' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Список желаний пользователя успешно очищен' })
  @Delete('user/:userId/clear')
  clearUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.clearUserWishlist(+userId);
  }

  @ApiOperation({ summary: 'Проверить наличие товара в списке желаний' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, type: Boolean, description: 'Результат проверки наличия товара' })
  @Get('check/:userId/:productId')
  isInWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.isInWishlist(+userId, +productId);
  }
} 