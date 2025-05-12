import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from '../models/payment-method.model';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  findAll() {
    return this.paymentMethodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodsService.findOne(+id);
  }

  @Get(':id/orders')
  getOrdersByPaymentMethod(@Param('id') id: string) {
    return this.paymentMethodsService.getOrdersByPaymentMethod(+id);
  }

  @Post()
  create(@Body() createPaymentMethodDto: Partial<PaymentMethod>) {
    return this.paymentMethodsService.create(createPaymentMethodDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: Partial<PaymentMethod>,
  ) {
    return this.paymentMethodsService.update(+id, updatePaymentMethodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodsService.remove(+id);
  }
} 