import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { Op, Sequelize } from 'sequelize';
import { OrderDetail } from '../models/order-detail.model';
import { Order } from '../models/order.model';
import { Inventory } from '../models/inventory.model';
import { Warehouse } from '../models/warehouse.model';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Inventory)
    private inventoryModel: typeof Inventory,
    @InjectModel(Warehouse)
    private warehouseModel: typeof Warehouse,
  ) {}

  async findAll(): Promise<Product[]> {
    try {
      this.logger.log('Ищу все товары...');
      const products = await this.productModel.findAll();
      
      return products;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске товаров:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      this.logger.log(`Ищу товар с id ${id}...`);
      const product = await this.productModel.findByPk(id);
      if (!product) {
        this.logger.warn(`Товар с id ${id} не найден 😢`);
        throw new Error('Товар не найден');
      }
      return product;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске товара ${id}:`, error);
      throw error;
    }
  }

  async create(productData: Partial<Product>): Promise<Product> {
    try {
      this.logger.log('Создаю новый товар...');
      const product = await this.productModel.create(productData);
      this.logger.log(`Ура! Создан товар с id: ${product.product_id} 🎉`);
      return product;
    } catch (error) {
      this.logger.error(' что-то пошло не так при создании товара:', error);
      throw error;
    }
  }

  async update(id: number, productData: Partial<Product>): Promise<[number, Product[]]> {
    try {
      this.logger.log(`Обновляю товар ${id}...`);
      const result = await this.productModel.update(productData, {
        where: { product_id: id },
        returning: true,
      });
      this.logger.log(`Готово! Товар ${id} обновлен ✨`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при обновлении товара ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    try {
      this.logger.log(`Удаляю товар ${id}...`);
      const result = await this.productModel.destroy({
        where: { product_id: id },
      });
      this.logger.log(`Товар ${id} удален 👋`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при удалении товара ${id}:`, error);
      throw error;
    }
  }


  async getPopularProducts(limit: number = 10): Promise<any[]> {
    try {
      this.logger.log('Ищу популярные товары...');
      const products = await this.productModel.findAll({
        attributes: [
          'product_id',
          'name',
          [Sequelize.fn('SUM', Sequelize.col('order_details.quantity')), 'total_sold'],
          [Sequelize.fn('SUM', Sequelize.literal('order_details.quantity * order_details.price_per_unit')), 'total_revenue']
        ],
        include: [{
          model: OrderDetail,
          required: true,
          include: [{
            model: Order,
            required: true,
            where: {
              order_date: {
                [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 3))
              }
            }
          }]
        }],
        group: ['product_id', 'name'],
        order: [[Sequelize.literal('total_sold'), 'DESC']],
        limit
      });
      this.logger.log(`Нашла ${products.length} популярных товаров! 🌟`);
      return products;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске популярных товаров:', error);
      throw error;
    }
  }


  async findByCategory(categoryId: number): Promise<Product[]> {
    try {
      this.logger.log(`Ищу товары в категории ${categoryId}...`);
      const products = await this.productModel.findAll({
        where: { category_id: categoryId },
        include: ['category']
      });
      this.logger.log(`ВОт ${products.length} товаров в этой категории! 📦`);
      return products;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске товаров в категории ${categoryId}:`, error);
      throw error;
    }
  }

 
  async findAvailable(): Promise<Product[]> {
    try {
      this.logger.log('Ищу доступные товары...');
      const products = await this.productModel.findAll({
        where: { is_available: true }
      });
      this.logger.log(`Вот ${products.length} доступных товаров! 🛒`);
      return products;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске доступных товаров:', error);
      throw error;
    }
  }

  async getSalesStatistics(months: number = 3): Promise<any[]> {
    try {
      this.logger.log(`Считаю статистику продаж за последние ${months} месяца...`);
      
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - months);

      const products = await this.productModel.findAll({
        include: [
          {
            model: OrderDetail,
            as: 'orderDetails',
            include: [
              {
                model: Order,
                as: 'order',
                where: {
                  order_date: {
                    [Op.gte]: threeMonthsAgo
                  }
                }
              }
            ]
          }
        ]
      });

      const result = products.map(product => ({
        product_id: product.product_id,
        name: product.name,
        total_sold: product.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0),
        total_revenue: product.orderDetails.reduce((sum, detail) => 
          sum + (detail.quantity * detail.price_per_unit), 0)
      }));

      result.sort((a, b) => b.total_sold - a.total_sold);
      return result.slice(0, 10);
    } catch (error) {
      this.logger.error('Что-то пошло не так при подсчете статистики:', error);
      throw error;
    }
  }

  async getProductInventoryStats() {
    try {
      this.logger.log('Считаю статистику по складам...');

      const products = await this.productModel.findAll({
        include: [
          {
            model: Inventory,
            as: 'inventory',
            include: [
              {
                model: Warehouse,
                as: 'warehouse'
              }
            ]
          }
        ],
        where: {
          is_available: true
        }
      });

      const result = products.map(product => {
        const totalQuantity = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
        const warehouses = product.inventory.map(inv => 
          `${inv.warehouse.name} (${inv.quantity})`
        ).join(', ');

        return {
          product_id: product.product_id,
          name: product.name,
          price: product.price,
          total_quantity: totalQuantity,
          warehouses
        };
      }).filter(item => item.total_quantity > 30 || !item.total_quantity)
        .sort((a, b) => a.name.localeCompare(b.name));

      this.logger.log(`Готово! Статистика для ${result.length} товаров 📦`);
      return result;
    } catch (error) {
      this.logger.error('Что-то пошло не так при подсчете статистики по складам:', error);
      throw error;
    }
  }
} 