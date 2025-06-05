import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address } from '../models/address.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({ summary: 'Получить все адреса' })
  @ApiResponse({ status: 200, type: [Address], description: 'Список адресов успешно получен' })
  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @ApiOperation({ summary: 'Получить адрес по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID адреса' })
  @ApiResponse({ status: 200, type: Address, description: 'Адрес успешно найден' })
  @ApiResponse({ status: 404, description: 'Адрес не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получить адреса пользователя' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, type: [Address], description: 'Адреса пользователя успешно получены' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get('user/:userId')
  getUserAddresses(@Param('userId') userId: string) {
    return this.addressesService.getUserAddresses(+userId);
  }

  @ApiOperation({ summary: 'Создать новый адрес' })
  @ApiBody({ type: Address })
  @ApiResponse({ status: 201, type: Address, description: 'Адрес успешно создан' })
  @Post()
  create(@Body() newAddress: Partial<Address>) {
    return this.addressesService.create(newAddress);
  }

  @ApiOperation({ summary: 'Обновить адрес' })
  @ApiParam({ name: 'id', type: Number, description: 'ID адреса' })
  @ApiBody({ type: Address })
  @ApiResponse({ status: 200, type: [Address], description: 'Адрес успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Адрес не найден' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedAddress: Partial<Address>) {
    return this.addressesService.update(+id, updatedAddress);
  }

  @ApiOperation({ summary: 'Удалить адрес' })
  @ApiParam({ name: 'id', type: Number, description: 'ID адреса' })
  @ApiResponse({ status: 200, description: 'Адрес успешно удален' })
  @ApiResponse({ status: 404, description: 'Адрес не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }

  @ApiOperation({ summary: 'Установить адрес по умолчанию' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID пользователя' })
  @ApiParam({ name: 'addressId', type: Number, description: 'ID адреса' })
  @ApiResponse({ status: 200, description: 'Адрес по умолчанию успешно установлен' })
  @ApiResponse({ status: 404, description: 'Пользователь или адрес не найден' })
  @Patch('user/:userId/default/:addressId')
  setDefaultAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.setDefaultAddress(+userId, +addressId);
  }
} 