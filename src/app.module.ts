import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
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

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    SequelizeModule.forFeature([
      User,
      Product,
      CartItem,
      Address,
      Order,
      OrderDetail,
      OrderStatus,
      PaymentMethod,
      Review,
      Wishlist,
      Inventory,
      Warehouse,
      Category
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
