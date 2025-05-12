import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderStatus } from '../models/order-status.model';
import { Order } from '../models/order.model';

@Injectable()
export class OrderStatusesService {
  constructor(
    @InjectModel(OrderStatus)
    private orderStatusModel: typeof OrderStatus,
  ) {}

  async findAll(): Promise<OrderStatus[]> {
    return this.orderStatusModel.findAll();
  }

  async findOne(id: number): Promise<OrderStatus> {
    const status = await this.orderStatusModel.findByPk(id, {
      include: [Order],
    });
    if (!status) {
      throw new Error('Order status не найдены(');
    }
    return status;
  }

  async create(orderStatusData: Partial<OrderStatus>): Promise<OrderStatus> {
    return this.orderStatusModel.create(orderStatusData);
  }

  async update(id: number, orderStatusData: Partial<OrderStatus>): Promise<[number, OrderStatus[]]> {
    return this.orderStatusModel.update(orderStatusData, {
      where: { status_id: id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.orderStatusModel.destroy({
      where: { status_id: id },
    });
  }

  async getOrdersByStatus(statusId: number): Promise<Order[]> {
    const status = await this.orderStatusModel.findByPk(statusId, {
      include: [Order],
    });
    return status?.orders || [];
  }
} 