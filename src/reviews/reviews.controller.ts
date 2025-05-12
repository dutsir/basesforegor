import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from '../models/review.model';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('recent')
  getRecentReviews(@Query('limit') limit?: number) {
    return this.reviewsService.getRecentReviews(limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(+productId);
  }

  @Get('product/:productId/rating')
  getProductRating(@Param('productId') productId: string) {
    return this.reviewsService.getProductRating(+productId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(+userId);
  }

  @Post()
  create(@Body() createReviewDto: Partial<Review>) {
    return this.reviewsService.create(createReviewDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: Partial<Review>,
  ) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
} 