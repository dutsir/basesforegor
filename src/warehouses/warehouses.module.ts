import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Warehouse } from '../models/warehouse.model';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';

@Module({
  imports: [SequelizeModule.forFeature([Warehouse])],
  providers: [WarehousesService],
  controllers: [WarehousesController],
  exports: [WarehousesService],
})
export class WarehousesModule {} 