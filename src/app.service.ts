import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Product } from './models/product.model';
import { CartItem } from './models/cart-item.model';
import { Address } from './models/address.model';
import { Order } from './models/order.model';
import { OrderDetail } from './models/order-detail.model';
import { OrderStatus } from './models/order-status.model';
import { PaymentMethod } from './models/payment-method.model';
import { Review } from './models/review.model';
import { Wishlist } from './models/wishlist.model';
import { Inventory } from './models/inventory.model';
import { Warehouse } from './models/warehouse.model';
import { Category } from './models/category.model';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    @InjectModel(OrderStatus)
    private orderStatusModel: typeof OrderStatus,
    @InjectModel(PaymentMethod)
    private paymentMethodModel: typeof PaymentMethod,
    @InjectModel(Review)
    private reviewModel: typeof Review,
    @InjectModel(Wishlist)
    private wishlistModel: typeof Wishlist,
    @InjectModel(Inventory)
    private inventoryModel: typeof Inventory,
    @InjectModel(Warehouse)
    private warehouseModel: typeof Warehouse,
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async checkDatabase() {
    try {

      if (!this.userModel.sequelize) {
        throw new Error('связи с базой  not initialized');
      }
      await this.userModel.sequelize.authenticate();
      this.logger.log('База связь есть');
      
     
      const [userCount, productCount, cartItemCount] = await Promise.all([
        this.userModel.count(),
        this.productModel.count(),
        this.cartItemModel.count(),
      ]);

     
      const sampleUser = await this.userModel.findOne({
        attributes: ['user_id', 'email', 'first_name', 'last_name'],
      });

      return {
        status: 'ok',
        message: 'База связь есть',
        tables: {
          users: userCount,
          products: productCount,
          cart_items: cartItemCount,
        },
        sample_data: {
          user: sampleUser ? {
            user_id: sampleUser.user_id,
            email: sampleUser.email,
            first_name: sampleUser.first_name,
            last_name: sampleUser.last_name,
          } : null,
        },
        database_path: (this.userModel.sequelize as any).config.storage,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('База проверка не прошла, связи нет', error);
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}