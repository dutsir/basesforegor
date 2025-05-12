import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Order } from './order.model';

@Table({
  tableName: 'PAYMENT_METHODS',
  timestamps: false
})
export class PaymentMethod extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'PAYMENT_METHOD_ID'
  })
  payment_method_id: number;

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