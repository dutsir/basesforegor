import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from '../models/payment-method.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @ApiOperation({ summary: 'Получить все методы оплаты' })
  @ApiResponse({ status: 200, type: [PaymentMethod], description: 'Список методов оплаты успешно получен' })
  @Get()
  findAll() {
    return this.paymentMethodsService.findAll();
  }

  @ApiOperation({ summary: 'Получить метод оплаты по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID метода оплаты' })
  @ApiResponse({ status: 200, type: PaymentMethod, description: 'Метод оплаты успешно найден' })
  @ApiResponse({ status: 404, description: 'Метод оплаты не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получить заказы по методу оплаты' })
  @ApiParam({ name: 'id', type: Number, description: 'ID метода оплаты' })
  @ApiResponse({ status: 200, description: 'Заказы успешно получены по методу оплаты' })
  @Get(':id/orders')
  getOrdersByPaymentMethod(@Param('id') id: string) {
    return this.paymentMethodsService.getOrdersByPaymentMethod(+id);
  }

  @ApiOperation({ summary: 'Создать новый метод оплаты' })
  @ApiBody({ type: PaymentMethod })
  @ApiResponse({ status: 201, type: PaymentMethod, description: 'Метод оплаты успешно создан' })
  @Post()
  create(@Body() createPaymentMethodDto: Partial<PaymentMethod>) {
    return this.paymentMethodsService.create(createPaymentMethodDto);
  }

  @ApiOperation({ summary: 'Обновить метод оплаты' })
  @ApiParam({ name: 'id', type: Number, description: 'ID метода оплаты' })
  @ApiBody({ type: PaymentMethod })
  @ApiResponse({ status: 200, type: PaymentMethod, description: 'Метод оплаты успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Метод оплаты не найден' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: Partial<PaymentMethod>,
  ) {
    return this.paymentMethodsService.update(+id, updatePaymentMethodDto);
  }

  @ApiOperation({ summary: 'Удалить метод оплаты' })
  @ApiParam({ name: 'id', type: Number, description: 'ID метода оплаты' })
  @ApiResponse({ status: 200, description: 'Метод оплаты успешно удален' })
  @ApiResponse({ status: 404, description: 'Метод оплаты не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodsService.remove(+id);
  }
} 