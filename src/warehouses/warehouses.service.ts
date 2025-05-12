import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Warehouse } from '../models/warehouse.model';
import { Inventory } from '../models/inventory.model';
import { Product } from '../models/product.model';
import { Op } from 'sequelize';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectModel(Warehouse)
    private warehouseModel: typeof Warehouse,
  ) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseModel.findAll();
  }

  async findOne(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseModel.findByPk(id, {
      include: [Inventory],
    });
    if (!warehouse) {
      throw new Error('Warehouse не найдены ошибочка');
    }
    return warehouse;
  }

  async create(warehouseData: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehouseModel.create(warehouseData);
  }

  async update(id: number, warehouseData: Partial<Warehouse>): Promise<[number, Warehouse[]]> {
    return this.warehouseModel.update(warehouseData, {
      where: { warehouse_id: id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.warehouseModel.destroy({
      where: { warehouse_id: id },
    });
  }

  async getInventory(warehouseId: number): Promise<Inventory[]> {
    const warehouse = await this.warehouseModel.findByPk(warehouseId, {
      include: [{
        model: Inventory,
        include: [Product],
      }],
    });
    return warehouse?.inventory || [];
  }

  async getLowStockItems(warehouseId: number, threshold: number = 10): Promise<Inventory[]> {
    const warehouse = await this.warehouseModel.findByPk(warehouseId, {
      include: [{
        model: Inventory,
        where: {
          quantity: {
            [Op.lt]: threshold,
          },
        },
        include: [Product],
      }],
    });
    return warehouse?.inventory || [];
  }
} 