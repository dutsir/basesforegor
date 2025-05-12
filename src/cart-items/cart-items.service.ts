import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

@Injectable()
export class CartItemsService {
  private readonly logger = new Logger(CartItemsService.name);

  constructor(
    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<CartItem[]> {
    try {
      this.logger.log('Ищу все товары в корзинах...');
      const items = await this.cartItemModel.findAll();
      return items;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске товаров в корзинах:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<CartItem> {
    try {
      this.logger.log(`Ищу товар в корзине с id: ${id}...`);
      const item = await this.cartItemModel.findByPk(id);
      if (!item) {
        this.logger.warn(`Товар в корзине с id ${id} не найден 😢`);
        throw new Error('Товар в корзине не найден');
      }
      return item;
    } catch (error) {
     
      throw error;
    }
  }

  async create(cartItemData: Partial<CartItem>): Promise<CartItem> {
    try {
      this.logger.log('Добавляю товар в корзину...');
      const item = await this.cartItemModel.create(cartItemData);
      this.logger.log(`Ура! Товар добавлен в корзину с id: ${item.cart_item_id} 🎉`);
      return item;
    } catch (error) {
      this.logger.error(' что-то пошло не так при добавлении товара в корзину:', error);
      throw error;
    }
  }

  async update(id: number, cartItemData: Partial<CartItem>): Promise<[number, CartItem[]]> {
    try {
      this.logger.log(`Обновляю товар в корзине ${id}...`);
      const result = await this.cartItemModel.update(cartItemData, {
        where: { cart_item_id: id },
        returning: true,
      });
      this.logger.log(`Готово! Товар в корзине ${id} обновлен ✨`);
      return result;
    } catch (error) {
      this.logger.error(`что-то пошло не так при обновлении товара в корзине ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    try {
      this.logger.log(`Удаляю товар из корзины ${id}...`);
      const result = await this.cartItemModel.destroy({
        where: { cart_item_id: id },
      });
      this.logger.log(`Товар удален из корзины 👋`);
      return result;
    } catch (error) {
      this.logger.error(`что-то пошло не так при удалении товара из корзины ${id}:`, error);
      throw error;
    }
  }

  async getUserCart(userId: number): Promise<CartItem[]> {
    try {
      this.logger.log(`Ищу корзину пользователя ${userId}...`);
      const items = await this.cartItemModel.findAll({
        where: { user_id: userId },
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      this.logger.log(`ВОт ${items.length} товаров в корзине пользователя! 🛍️`);
      return items;
    } catch (error) {
      this.logger.error(`блять что-то пошло не так при поиске корзины пользователя ${userId}:`, error);
      throw error;
    }
  }

  async updateQuantity(id: number, quantity: number): Promise<[number, CartItem[]]> {
    try {
      this.logger.log(`Меняю количество товара ${id} на ${quantity}...`);
      const result = await this.cartItemModel.update(
        { quantity },
        {
          where: { cart_item_id: id },
          returning: true,
        }
      );
      this.logger.log(`Готово! Количество товара обновлено ✨`);
      return result;
    } catch (error) {
      this.logger.error(`еба что-то пошло не так при обновлении количества товара ${id}:`, error);
      throw error;
    }
  }

  async clearUserCart(userId: number): Promise<number> {
    try {
      this.logger.log(`Очищаю корзину пользователя ${userId}...`);
      const result = await this.cartItemModel.destroy({
        where: { user_id: userId }
      });
      this.logger.log(`Корзина пользователя очищена! 🧹`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при очистке корзины пользователя ${userId}:`, error);
      throw error;
    }
  }
} 