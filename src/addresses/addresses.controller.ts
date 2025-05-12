import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address } from '../models/address.model';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Get('user/:userId')
  getUserAddresses(@Param('userId') userId: string) {
    return this.addressesService.getUserAddresses(+userId);
  }

  @Post()
  create(@Body() newAddress: Partial<Address>) {
    return this.addressesService.create(newAddress);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedAddress: Partial<Address>) {
    return this.addressesService.update(+id, updatedAddress);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }

  @Patch('user/:userId/default/:addressId')
  setDefaultAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.setDefaultAddress(+userId, +addressId);
  }
} 