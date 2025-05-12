import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Inventory } from '../models/inventory.model';
import { Product } from '../models/product.model';
import { Warehouse } from '../models/warehouse.model';
import { Op } from 'sequelize';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory)
    private inventoryModel: typeof Inventory,
  ) {}

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.findAll({
      include: [Product, Warehouse],
    });
  }

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.inventoryModel.findByPk(id, {
      include: [Product, Warehouse],
    });
    if (!inventory) {
      throw new Error('Inventory не найдены');
    }
    return inventory;
  }

  async create(inventoryData: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryModel.create(inventoryData);
  }

  async update(id: number, inventoryData: Partial<Inventory>): Promise<[number, Inventory[]]> {
    return this.inventoryModel.update(inventoryData, {
      where: { inventory_id: id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.inventoryModel.destroy({
      where: { inventory_id: id },
    });
  }

  async findByProduct(productId: number): Promise<Inventory[]> {
    return this.inventoryModel.findAll({
      where: { product_id: productId },
      include: [Warehouse],
    });
  }

  async findByWarehouse(warehouseId: number): Promise<Inventory[]> {
    return this.inventoryModel.findAll({
      where: { warehouse_id: warehouseId },
      include: [Product],
    });
  }

  async getLowStockItems(threshold: number = 10): Promise<Inventory[]> {
    return this.inventoryModel.findAll({
      where: {
        quantity: {
          [Op.lt]: threshold,
        },
      },
      include: [Product, Warehouse],
    });
  }

  async updateStock(
    productId: number,
    warehouseId: number,
    quantity: number,
  ): Promise<[number, Inventory[]]> {
    return this.inventoryModel.update(
      {
        quantity,
        last_restock_date: new Date(),
      },
      {
        where: {
          product_id: productId,
          warehouse_id: warehouseId,
        },
        returning: true,
      },
    );
  }
} 