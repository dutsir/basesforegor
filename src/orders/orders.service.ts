import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../models/order.model';
import { OrderDetail } from '../models/order-detail.model';
import { Product } from '../models/product.model';
import { OrderStatus } from '../models/order-status.model';
import { PaymentMethod } from '../models/payment-method.model';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(OrderStatus)
    private orderStatusModel: typeof OrderStatus,
    @InjectModel(PaymentMethod)
    private paymentMethodModel: typeof PaymentMethod,
  ) {}

  async getOrdersWithProductsByUser(userId: number) {
    try {
      this.logger.log(`Ищу заказы пользователя ${userId}...`);

      const orders = await this.orderModel.findAll({
        include: [
          {
            model: OrderStatus,
            attributes: ['name'],
            as: 'status'
          },
          {
            model: PaymentMethod,
            attributes: ['name'],
            as: 'paymentMethod'
          },
          {
            model: OrderDetail,
            as: 'orderDetails',
            include: [
              {
                model: Product,
                attributes: ['name'],
                as: 'product'
              }
            ]
          }
        ],
        where: {
          user_id: userId
        },
        order: [['order_date', 'DESC']]
      });

      const result = orders.map(order => ({
        order_id: order.order_id,
        order_date: order.order_date,
        total_price: order.total_price,
        products_count: order.orderDetails.length,
        products: order.orderDetails.map(detail => detail.product.name).join(', '),
        status: order.status.name,
        payment_method: order.paymentMethod.name
      }));

      this.logger.log(`ВООООООТ ${result.length} заказов для пользователя ${userId} 🛍️`);
      return result;
    } catch (error) {
      this.logger.error(`Что-то пошло не так при поиске заказов пользователя ${userId}:`, error);
      throw error;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      this.logger.log('Создаю новый заказ...');
      const order = await this.orderModel.create(orderData);
      this.logger.log(`Ура! Создан заказ с id: ${order.order_id} 🎉`);
      return order;
    } catch (error) {
      this.logger.error('что-то пошло не так при создании заказа:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: number, statusId: number): Promise<[number, Order[]]> {
    try {
      this.logger.log(`Обновляю статус заказа ${orderId}...`);
      const result = await this.orderModel.update(
        { status_id: statusId },
        {
          where: { order_id: orderId },
          returning: true,
        }
      );
      this.logger.log(`Готово! Статус заказа ${orderId} обновлен ✨`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при обновлении статуса заказа ${orderId}:`, error);
      throw error;
    }
  }

  async addOrderDetail(detailData: Partial<OrderDetail>): Promise<OrderDetail> {
    try {
      this.logger.log('Добавляю товар в заказ...');
      const detail = await this.orderDetailModel.create(detailData);
      this.logger.log(`Готово! Товар добавлен в заказ 🛒`);
      return detail;
    } catch (error) {
      this.logger.error('что-то пошло не так при добавлении товара в заказ:', error);
      throw error;
    }
  }

  async getOrderDetails(orderId: number): Promise<OrderDetail[]> {
    try {
      this.logger.log(`Ищу детали заказа ${orderId}...`);
      const details = await this.orderDetailModel.findAll({
        where: { order_id: orderId },
        include: [
          {
            model: Product,
            as: 'product'
          }
        ]
      });
      this.logger.log(`Вот ${details.length} товаров в заказе 📦`);
      return details;
    } catch (error) {
      this.logger.error(`что-то пошло не так при поиске деталей заказа ${orderId}:`, error);
      throw error;
    }
  }
} 