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

      const users = await this.userModel.findAll({
        include: [
          {
            model: Order,
            as: 'orders',
            include: [
              {
                model: OrderDetail,
                as: 'orderDetails'
              },
              {
                model: OrderStatus,
                as: 'status',
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
        ]
      });

      const result = users.map(user => {
        const totalSpent = user.orders.reduce((sum, order) => 
          sum + order.orderDetails.reduce((orderSum, detail) => 
            orderSum + (detail.quantity * detail.price_per_unit), 0), 0);
        
        const totalOrders = user.orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        return {
          user_id: user.user_id,
          full_name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          total_orders: totalOrders,
          total_spent: totalSpent,
          avg_order_value: Math.round(avgOrderValue * 100) / 100
        };
      });

      result.sort((a, b) => b.total_spent - a.total_spent);
      return result.slice(0, 5);
    } catch (error) {
      this.logger.error('Что-то пошло не так при поиске топовых покупателей:', error);
      throw error;
    }
  }
} 