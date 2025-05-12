import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address } from '../models/address.model';
import { User } from '../models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Address,
      User
    ])
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService]
})
export class AddressesModule {} 