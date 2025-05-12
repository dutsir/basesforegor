import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Order } from '../models/order.model';
import { OrderDetail } from '../models/order-detail.model';
import { OrderStatus } from '../models/order-status.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Order,
      OrderDetail,
      OrderStatus
    ])
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {} 