import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaymentMethod } from '../models/payment-method.model';
import { Order } from '../models/order.model';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethod)
    private paymentMethodModel: typeof PaymentMethod,
  ) {}

  async findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodModel.findAll();
  }

  async findOne(id: number): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodModel.findByPk(id, {
      include: [Order],
    });
    if (!paymentMethod) {
      throw new Error('Payment method не найден ((');
    }
    return paymentMethod;
  }

  async create(paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return this.paymentMethodModel.create(paymentMethodData);
  }

  async update(id: number, paymentMethodData: Partial<PaymentMethod>): Promise<[number, PaymentMethod[]]> {
    return this.paymentMethodModel.update(paymentMethodData, {
      where: { payment_method_id: id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.paymentMethodModel.destroy({
      where: { payment_method_id: id },
    });
  }

  async getOrdersByPaymentMethod(paymentMethodId: number): Promise<Order[]> {
    const paymentMethod = await this.paymentMethodModel.findByPk(paymentMethodId, {
      include: [Order],
    });
    return paymentMethod?.orders || [];
  }
} 