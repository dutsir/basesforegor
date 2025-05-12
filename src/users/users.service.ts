import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { OrderDetail } from '../models/order-detail.model';
import { OrderStatus } from '../models/order-status.model';
import { Sequelize, Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    @InjectModel(OrderStatus)
    private orderStatusModel: typeof OrderStatus,
  ) {}

  async createTestUser(): Promise<User> {
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    return this.userModel.create({
      email: 'test@example.com',
      password_hash: hashedPassword,
      first_name: 'Test',
      last_name: 'User',
      phone: '+1234567890',
    });
  }

  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Ищу всех пользователей...');
      const users = await this.userModel.findAll();
      this.logger.log(`ВОт ${users.length} пользователи! 💕`);
      return users;
    } catch (error) {
      this.logger.error('что-то пошло не так при поиске пользователей:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      this.logger.log(`Ищу пользователя с id: ${id}...`);
      const user = await this.userModel.findByPk(id);
      if (!user) {
        this.logger.warn(`Пользователь с id ${id} не найден 😢`);
        throw new Error('Пользователь не найден');
      }
      return user;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске пользователя ${id}:`, error);
      throw error;
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      this.logger.log('Создаю нового пользователя...');
      const user = await this.userModel.create(userData);
      this.logger.log(`Ура! Создан пользователь с id: ${user.user_id} 🎉`);
      return user;
    } catch (error) {
      this.logger.error('что-то пошло не так при создании пользователя:', error);
      throw error;
    }
  }

  async update(id: number, userData: Partial<User>): Promise<[number, User[]]> {
    try {
      this.logger.log(`Обновляю пользователя ${id}...`);
      const result = await this.userModel.update(userData, {
        where: { user_id: id },
        returning: true,
      });
      this.logger.log(`Готово! Пользователь ${id} обновлен ✨`);
      return result;
    } catch (error) {
      this.logger.error(`Ой, что-то пошло не так при обновлении пользователя ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    try {
      this.logger.log(`Удаляю пользователя ${id}...`);
      const result = await this.userModel.destroy({
        where: { user_id: id },
      });
      this.logger.log(`Пользователь ${id} удален 👋`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при удалении пользователя ${id}:`, error);
      throw error;
    }
  }

  async getTopSpendingUsers() {
    try {
      this.logger.log('Ищу самых щедрых покупателей...');

      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);

      const result = await this.userModel.findAll({
        attributes: [
          'user_id',
          [
            Sequelize.literal('first_name || " " || last_name'),
            'full_name'
          ],
          'email',
          [
            Sequelize.literal('COUNT(DISTINCT "orders"."ORDER_ID")'),
            'total_orders'
          ],
          [
            Sequelize.literal('SUM("orders->orderDetails"."QUANTITY" * "orders->orderDetails"."PRICE_PER_UNIT")'),
            'total_spent'
          ],
          [
            Sequelize.literal('ROUND(AVG("orders->orderDetails"."QUANTITY" * "orders->orderDetails"."PRICE_PER_UNIT"), 2)'),
            'avg_order_value'
          ]
        ],
        include: [
          {
            model: Order,
            as: 'orders',
            attributes: [],
            include: [
              {
                model: OrderDetail,
                as: 'orderDetails',
                attributes: []
              },
              {
                model: OrderStatus,
                as: 'status',
                attributes: [],
                where: {
                  name: 'Delivered'
                }
              }
            ],
            where: {
              order_date: {
                [Op.gte]: yearAgo
              }
            }
          }
        ],
        group: ['User.user_id', 'User.first_name', 'User.last_name', 'User.email'],
        order: [[Sequelize.literal('total_spent'), 'DESC']],
        limit: 5,
        subQuery: false
      });

      this.logger.log(`ВОт ${result.length} самые щедрые покупатели! 💰`);
      return result;
    } catch (error) {
      this.logger.error('что-то пошло не так при поиске щедрых покупателей:', error);
      throw error;
    }
  }
} 