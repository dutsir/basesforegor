import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Inventory } from '../models/inventory.model';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [SequelizeModule.forFeature([Inventory])],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {} 