import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany, Index } from 'sequelize-typescript';
import { User } from './user.model';
import { Address } from './address.model';
import { OrderDetail } from './order-detail.model';
import { OrderStatus } from './order-status.model';
import { PaymentMethod } from './payment-method.model';

@Table({
  tableName: 'ORDERS',
  timestamps: false,
  indexes: [
    {
      name: 'idx_orders_user',
      fields: ['user_id']
    },
    {
      name: 'idx_orders_status',
      fields: ['status_id']
    },
    {
      name: 'idx_orders_date',
      fields: ['order_date']
    }
  ]
})
export class Order extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'USER_ID'
  })
  user_id: number;

  @ForeignKey(() => OrderStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'STATUS_ID'
  })
  status_id: number;

  @ForeignKey(() => PaymentMethod)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'PAYMENT_METHOD_ID'
  })
  payment_method_id: number;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'SHIPPING_ADDRESS_ID'
  })
  shipping_address_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'ORDER_DATE'
  })
  order_date: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'TOTAL_PRICE',
    validate: {
      min: 0
    }
  })
  total_price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'DELIVERY_PRICE',
    validate: {
      min: 0
    }
  })
  delivery_price: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'TRACKING_NUMBER'
  })
  tracking_number: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'NOTES'
  })
  notes: string;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE'
  })
  user: User;

  @BelongsTo(() => Address)
  shippingAddress: Address;

  @BelongsTo(() => OrderStatus, {
    foreignKey: 'status_id',
    targetKey: 'status_id'
  })
  status: OrderStatus;

  @BelongsTo(() => PaymentMethod, {
    foreignKey: 'payment_method_id',
    targetKey: 'payment_method_id'
  })
  paymentMethod: PaymentMethod;

  @HasMany(() => OrderDetail, {
    onDelete: 'CASCADE'
  })
  orderDetails: OrderDetail[];

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ORDER_ID'
  })
  order_id: number;
} 