import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Wishlist } from '../models/wishlist.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
    @InjectModel(Wishlist)
    private wishlistModel: typeof Wishlist,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    try {
      this.logger.log('Ищу все избранные товары...');
      const items = await this.wishlistModel.findAll();
      this.logger.log(`вот ${items.length} избранные товары! 💝`);
      return items;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске избранных товаров:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Wishlist> {
    try {
      this.logger.log(`Ищу избранный товар с id: ${id}...`);
      const item = await this.wishlistModel.findByPk(id);
      if (!item) {
        this.logger.warn(`Избранный товар с id ${id} не найден 😢`);
        throw new Error('Избранный товар не найден');
      }
      return item;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске избранного товара ${id}:`, error);
      throw error;
    }
  }

  async create(wishlistData: Partial<Wishlist>): Promise<Wishlist> {
    try {
      this.logger.log('Добавляю товар в избранное...');
      const item = await this.wishlistModel.create(wishlistData);
      this.logger.log(`Ура! Товар добавлен в избранное с id: ${item.wishlist_id} 🎉`);
      return item;
    } catch (error) {
      this.logger.error('Ой, что-то пошло не так при добавлении товара в избранное:', error);
      throw error;
    }
  }

  async update(id: number, wishlistData: Partial<Wishlist>): Promise<[number, Wishlist[]]> {
    return this.wishlistModel.update(wishlistData, {
      where: { wishlist_id: id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    try {
      this.logger.log(`Удаляю товар из избранного ${id}...`);
      const result = await this.wishlistModel.destroy({
        where: { wishlist_id: id },
      });
      this.logger.log(`Товар удален из избранного 👋`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при удалении товара из избранного ${id}:`, error);
      throw error;
    }
  }

  async getUserWishlist(userId: number): Promise<Wishlist[]> {
    try {
      this.logger.log(`Ищу избранное пользователя ${userId}...`);
      const items = await this.wishlistModel.findAll({
        where: { user_id: userId },
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      
      return items;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске избранного пользователя ${userId}:`, error);
      throw error;
    }
  }

  async clearUserWishlist(userId: number): Promise<number> {
    try {
      this.logger.log(`Очищаю избранное пользователя ${userId}...`);
      const result = await this.wishlistModel.destroy({
        where: { user_id: userId }
      });
      this.logger.log(`Избранное пользователя очищено! 🧹`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при очистке избранного пользователя ${userId}:`, error);
      throw error;
    }
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    try {
      this.logger.log(`Проверяю, есть ли товар ${productId} в избранном пользователя ${userId}...`);
      const item = await this.wishlistModel.findOne({
        where: {
          user_id: userId,
          product_id: productId
        }
      });
      const isInWishlist = !!item;
      this.logger.log(`Товар ${isInWishlist ? 'найден' : 'не найден'} в избранном ${isInWishlist ? '💖' : '💔'}`);
      return isInWishlist;
    } catch (error) {
      this.logger.error(` что-то пошло не так при проверке избранного:`, error);
      throw error;
    }
  }
} 