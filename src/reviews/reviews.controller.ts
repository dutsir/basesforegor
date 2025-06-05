import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from '../models/review.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Получить все отзывы' })
  @ApiResponse({ status: 200, type: [Review], description: 'Список отзывов успешно получен' })
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({ summary: 'Получить свежие отзывы' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество свежих отзывов' })
  @ApiResponse({ status: 200, type: [Review], description: 'Список свежих отзывов успешно получен' })
  @Get('recent')
  getRecentReviews(@Query('limit') limit?: number) {
    return this.reviewsService.getRecentReviews(limit);
  }

  @ApiOperation({ summary: 'Получить отзыв по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID отзыва' })
  @ApiResponse({ status: 200, type: Review, description: 'Отзыв успешно найден' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получить отзывы по товару' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, type: [Review], description: 'Список отзывов по товару успешно получен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(+productId);
  }

  @ApiOperation({ summary: 'Получить рейтинг товара' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, type: Number, description: 'Средний рейтинг товара успешно получен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @Get('product/:productId/rating')
  getProductRating(@Param('productId') productId: string) {
    return this.reviewsService.getProductRating(+productId);
  }

  @ApiOperation({ summary: 'Получить отзывы пользователя' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, type: [Review], description: 'Список отзывов пользователя успешно получен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(+userId);
  }

  @ApiOperation({ summary: 'Создать новый отзыв' })
  @ApiBody({ type: Review })
  @ApiResponse({ status: 201, type: Review, description: 'Отзыв успешно создан' })
  @Post()
  create(@Body() createReviewDto: Partial<Review>) {
    return this.reviewsService.create(createReviewDto);
  }

  @ApiOperation({ summary: 'Обновить отзыв' })
  @ApiParam({ name: 'id', type: Number, description: 'ID отзыва' })
  @ApiBody({ type: Review })
  @ApiResponse({ status: 200, type: Review, description: 'Отзыв успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: Partial<Review>,
  ) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @ApiOperation({ summary: 'Удалить отзыв' })
  @ApiParam({ name: 'id', type: Number, description: 'ID отзыва' })
  @ApiResponse({ status: 200, description: 'Отзыв успешно удален' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
} 