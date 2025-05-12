import { Column, DataType, Model, Table, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Order } from './order.model';
import { Product } from './product.model';

@Table({
  tableName: 'ORDER_DETAILS',
  timestamps: false,
  indexes: [
    {
      name: 'idx_order_details_order',
      fields: ['order_id']
    },
    {
      name: 'idx_order_details_product',
      fields: ['product_id']
    },
    {
      name: 'idx_order_details_order_product_qty',
      fields: ['order_id', 'product_id', 'quantity']
    }
  ]
})
export class OrderDetail extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ORDER_DETAIL_ID'
  })
  order_detail_id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'ORDER_ID'
  })
  order_id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'PRODUCT_ID'
  })
  product_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'QUANTITY',
    validate: {
      min: 1
    }
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'PRICE_PER_UNIT',
    validate: {
      min: 0
    }
  })
  price_per_unit: number;

  @BelongsTo(() => Order, {
    onDelete: 'CASCADE'
  })
  order: Order;

  @BelongsTo(() => Product)
  product: Product;
} 