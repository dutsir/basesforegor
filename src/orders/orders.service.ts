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

  async getOrdersWithProductsByUser(userId: number): Promise<any[]> {
    try {
  

      const orders = await this.orderModel.findAll({
        where: { user_id: userId },
        include: [
          {
            model: OrderDetail,
            as: 'orderDetails',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['product_id', 'name', 'price']
              }
            ]
          },
          {
            model: OrderStatus,
            as: 'status',
            attributes: ['status_id', 'name']
          },
          {
            model: PaymentMethod,
            as: 'paymentMethod',
            attributes: ['payment_method_id', 'name']
          }
        ],
        order: [['order_date', 'DESC']]
      });
      console.log('ORDERS RAW RESULT:', JSON.stringify(orders, null, 2));

      if (!orders || orders.length === 0) {
        return [];
      }

      return orders.map(order => {
        const plainOrder = order.get({ plain: true });
        const orderDetails = plainOrder.orderDetails || [];
        const products = orderDetails.map(detail => ({
          product_id: detail.product?.product_id,
          name: detail.product?.name || 'Товар не найден',
          quantity: detail.quantity,
          price_per_unit: detail.price_per_unit,
          total_price: detail.quantity * detail.price_per_unit
        }));

        return {
          order_id: plainOrder.order_id,
          order_date: plainOrder.order_date,
          status: plainOrder.status?.name || 'Неизвестный статус',
          payment_method: plainOrder.paymentMethod?.name || 'Неизвестный метод оплаты',
          total_price: plainOrder.total_price,
          delivery_price: plainOrder.delivery_price,
          tracking_number: plainOrder.tracking_number,
          products: products,
          products_count: products.length,
          total_items: products.reduce((sum, product) => sum + product.quantity, 0)
        };
      });
    } catch (error) {
      this.logger.error(`чето  пошло не так ${userId}`, error);
      throw error;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
   
      const order = await this.orderModel.create(orderData);
   
      return order;
    } catch (error) {
    
      throw error;
    }
  }

  async updateOrderStatus(orderId: number, statusId: number): Promise<[number, Order[]]> {
    try {
     
      const result = await this.orderModel.update(
        { status_id: statusId },
        {
          where: { order_id: orderId },
          returning: true,
        }
      );
   
      return result;
    } catch (error) {
     
      throw error;
    }
  }

  async addOrderDetail(detailData: Partial<OrderDetail>): Promise<OrderDetail> {
    try {

      const detail = await this.orderDetailModel.create(detailData);
      
      return detail;
    } catch (error) {
    
      throw error;
    }
  }

  async getOrderDetails(orderId: number): Promise<OrderDetail[]> {
    try {
   
      const details = await this.orderDetailModel.findAll({
        where: { order_id: orderId },
        include: [
          {
            model: Product,
            as: 'product'
          }
        ]
      });
 
      return details;
    } catch (error) {
     
      throw error;
    }
  }
} 