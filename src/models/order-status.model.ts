import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Order } from './order.model';

@Table({
  tableName: 'ORDER_STATUSES',
  timestamps: false
})
export class OrderStatus extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'STATUS_ID'
  })
  status_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'NAME'
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'DESCRIPTION'
  })
  description: string;

  @HasMany(() => Order)
  orders: Order[];
} 