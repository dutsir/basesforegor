import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { Op, Sequelize, QueryTypes } from 'sequelize';
import { OrderDetail } from '../models/order-detail.model';
import { Order } from '../models/order.model';
import { Inventory } from '../models/inventory.model';
import { Warehouse } from '../models/warehouse.model';
import { SalesAndInventoryStatsResult } from './dto/sales-and-inventory-stats-result.dto';
import { Review } from '../models/review.model';


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
    @InjectModel(Review)
    private reviewModel: typeof Review,
  ) {}

  async findAll(): Promise<Product[]> {
    try {
      
      const products = await this.productModel.findAll();
      return products.map(product => product.get({ plain: true }));
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
       
        throw new Error('Товар не найден');
      }
      return product.get({ plain: true });
    } catch (error) {
      
      throw error;
    }
  }

  async create(productData: Partial<Product>): Promise<Product> {
    try {
   
      const product = await this.productModel.create(productData);
     
      return product;
    } catch (error) {
      this.logger.error(' что-то пошло не так при создании товара:', error);
      throw error;
    }
  }

  async update(id: number, productData: Partial<Product>): Promise<[number, Product[]]> {
    try {
   
      const result = await this.productModel.update(productData, {
        where: { product_id: id },
        returning: true,
      });
    
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при обновлении товара ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    try {
   
      const result = await this.productModel.destroy({
        where: { product_id: id },
      });
      
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при удалении товара ${id}:`, error);
      throw error;
    }
  }


  async getPopularProducts(limit: number = 10): Promise<any[]> {
    try {
      
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
 
      return products;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске популярных товаров:', error);
      throw error;
    }
  }


  async findByCategory(categoryId: number): Promise<Product[]> {
    try {
     
      const products = await this.productModel.findAll({
        where: { category_id: categoryId },
        include: ['category']
      });
    
      return products;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске товаров в категории ${categoryId}:`, error);
      throw error;
    }
  }

 
  async findAvailable(): Promise<Product[]> {
    try {
   
      const products = await this.productModel.findAll({
        where: { is_available: true }
      });
    
      return products;
    } catch (error) {
      this.logger.error(' чето пошло не так при поиске доступных товаров', error);
      throw error;
    }
  }


  async getSalesAndInventoryStats(months: number = 6, limit: number = 10): Promise<SalesAndInventoryStatsResult[]> {
    try {
      
      const validMonths = Math.max(1, Math.min(months || 6, 12)); 
      const validLimit = Math.max(1, Math.min(limit || 10, 100)); 



      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - validMonths);

      const salesStats = await this.productModel.findAll({
        attributes: [
          'product_id',
          'name',
          [Sequelize.literal('SUM(`orderDetails`.`QUANTITY`)'), 'total_sold']
        ],
        include: [{
          model: OrderDetail,
          as: 'orderDetails',
          attributes: [],
          include: [{
            model: Order,
            as: 'order',
            attributes: [],
            where: {
              order_date: {
                [Op.gte]: sixMonthsAgo
              }
            },
            required: true
          }]
        }],
        group: ['Product.product_id', 'Product.name'],
        order: [[Sequelize.literal('total_sold'), 'DESC']],
        limit: validLimit
      });

      
      const productIds = salesStats.map(stat => stat.get('product_id'));
      const inventoryStats = await this.productModel.findAll({
        attributes: [
          'product_id',
          [Sequelize.literal('SUM(`inventory`.`QUANTITY`)'), 'total_stock']
        ],
        include: [{
          model: Inventory,
          as: 'inventory',
          attributes: [],
          required: false
        }],
        where: {
          product_id: {
            [Op.in]: productIds
          }
        },
        group: ['Product.product_id']
      });

      
      const inventoryMap = new Map(
        inventoryStats.map(stat => [
          stat.get('product_id'),
          Number(stat.get('total_stock')) || 0
        ])
      );

      const results = salesStats.map(stat => ({
        product_id: Number(stat.get('product_id')),
        name: String(stat.get('name')),
        total_sold: Number(stat.get('total_sold')) || 0,
        total_stock: inventoryMap.get(Number(stat.get('product_id'))) || 0
      }));

   
      return results as SalesAndInventoryStatsResult[];
    } catch (error) {
      this.logger.error('чето пошло не так при подсчете статистики продаж и запасов:', error);
      throw error;
    }
  }

  async getProductInventoryStats() {
    try {
   

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
        const plainProduct = product.get({ plain: true });
       
        
     
        const inventory = Array.isArray(plainProduct.inventory) ? plainProduct.inventory : [];
        
        const totalQuantity = inventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
        const warehouses = inventory.map(inv => 
          `${inv.warehouse?.name || 'Unknown'} (${inv.quantity || 0})`
        ).join(', ');

        return {
          product_id: plainProduct.product_id,
          name: plainProduct.name,
          price: plainProduct.price,
          total_quantity: totalQuantity,
          warehouses
        };
      }).filter(item => item.total_quantity > 30 || !item.total_quantity)
        .sort((a, b) => a.name.localeCompare(b.name));

     
      const filteredAndSortedResult = result
        .filter(item => item.total_quantity > 30 || !item.total_quantity)
        .sort((a, b) => a.name.localeCompare(b.name));

      return filteredAndSortedResult;

    } catch (error) {
      this.logger.error('че то не то со статистикой по складам', error);
      throw error;
    }
  }

  async getProductAnalytics(): Promise<any[]> {
    try {
     

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

 
      const salesStats = await this.orderDetailModel.findAll({
        attributes: [
          'product_id',
          [Sequelize.fn('COUNT', Sequelize.col('OrderDetail.order_id')), 'total_orders'],
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_sold'],
          [Sequelize.fn('SUM', Sequelize.literal('`OrderDetail`.`quantity` * `OrderDetail`.`price_per_unit`')), 'total_revenue'],
          [Sequelize.fn('AVG', Sequelize.col('quantity')), 'avg_order_quantity'],
        ],
        include: [{
          model: Order,
          as: 'order',
          attributes: [],
          where: {
            order_date: { [Op.gte]: oneYearAgo },
            status_id: 3 
          },
          required: true
        }],
        group: ['product_id'],
      });

      // Преобразуем результаты продаж в Map для удобного доступа по product_id
      const salesMap = new Map<number, any>();
      salesStats.forEach(item => {
        const plainItem = item.get({ plain: true });
        salesMap.set(plainItem.product_id, {
          product_id: plainItem.product_id,
          total_orders: Number(plainItem.total_orders) || 0,
          total_sold: Number(plainItem.total_sold) || 0,
          total_revenue: Number(plainItem.total_revenue) || 0,
          avg_order_quantity: Number(plainItem.avg_order_quantity) || 0,
        });
      });

     
      const productIdsWithSales = Array.from(salesMap.keys());

      if (productIdsWithSales.length === 0) {
        this.logger.log('Нет продуктов с продажами за последний год.');
        return [];
      }

     
      const reviewStats = await this.reviewModel.findAll({
        attributes: [
          'product_id',
          [Sequelize.fn('COUNT', Sequelize.col('review_id')), 'total_reviews'],
          [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating'],
        ],
        where: {
          product_id: { [Op.in]: productIdsWithSales } 
        },
        group: ['product_id'],
      });

     
      const reviewMap = new Map<number, any>();
      reviewStats.forEach(item => {
        const plainItem = item.get({ plain: true });
        reviewMap.set(plainItem.product_id, {
          total_reviews: Number(plainItem.total_reviews) || 0,
          avg_rating: Number(plainItem.avg_rating) || 0,
        });
      });

      
      const inventoryStats = await this.inventoryModel.findAll({
        attributes: [
          'product_id',
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'current_stock'],
        ],
        where: {
          product_id: { [Op.in]: productIdsWithSales } 
        },
        group: ['product_id'],
      });

      
      const inventoryMap = new Map<number, any>();
      inventoryStats.forEach(item => {
        const plainItem = item.get({ plain: true });
        inventoryMap.set(plainItem.product_id, {
          current_stock: Number(plainItem.current_stock) || 0,
        });
      });

     
      const productsWithSales = await this.productModel.findAll({
        attributes: ['product_id', 'name'],
        where: {
          product_id: { [Op.in]: productIdsWithSales }
        }
      });

      const finalResults: any[] = [];
      productsWithSales.forEach(product => {
        const plainProduct = product.get({ plain: true });
        const productId = plainProduct.product_id;

        const sales = salesMap.get(productId) || {};
        const reviews = reviewMap.get(productId) || {};
        const inventory = inventoryMap.get(productId) || {};

        const combinedStats = {
          product_id: productId,
          name: plainProduct.name,
          ...sales,
          ...reviews,
          ...inventory
        };

     
        if (combinedStats.total_orders >= 1 && combinedStats.total_reviews >= 1) {
          finalResults.push(combinedStats);
        }
      });

   
      finalResults.sort((a, b) => b.total_revenue - a.total_revenue);
      const limitedResults = finalResults.slice(0, 10);

  
      return limitedResults;

    } catch (error) {
  
      throw error;
    }
  }
} 