import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '../models/review.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review)
    private reviewModel: typeof Review,
  ) {}

  async findAll(): Promise<Review[]> {
    const reviews = await this.reviewModel.findAll({
      include: [Product, User],
    });
    return reviews.map(review => review.get({ plain: true }));
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewModel.findByPk(id, {
      include: [Product, User],
    });
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  }

  async create(reviewData: Partial<Review>): Promise<Review> {
    return this.reviewModel.create(reviewData);
  }

  async update(id: number, reviewData: Partial<Review>): Promise<[number, Review[]]> {
    return this.reviewModel.update(reviewData, {
      where: { review_id: id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.reviewModel.destroy({
      where: { review_id: id },
    });
  }

  async findByProduct(productId: number): Promise<Review[]> {
    return this.reviewModel.findAll({
      where: { product_id: productId },
      include: [User],
      order: [['review_date', 'DESC']],
    });
  }

  async findByUser(userId: number): Promise<Review[]> {
    return this.reviewModel.findAll({
      where: { user_id: userId },
      include: [Product],
      order: [['review_date', 'DESC']],
    });
  }

  async getProductRating(productId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const reviews = await this.reviewModel.findAll({
      where: { product_id: productId },
      attributes: ['rating'],
    });

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
    };
  }

  async getRecentReviews(limit: number = 10): Promise<Review[]> {
    return this.reviewModel.findAll({
      include: [Product, User],
      order: [['review_date', 'DESC']],
      limit,
    });
  }
} 