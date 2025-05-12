import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';

@Table({
  tableName: 'WISHLIST',
  timestamps: false
})
export class Wishlist extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'WISHLIST_ID'
  })
  wishlist_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'USER_ID'
  })
  user_id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'PRODUCT_ID'
  })
  product_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'ADDED_DATE'
  })
  added_date: Date;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE'
  })
  user: User;

  @BelongsTo(() => Product, {
    onDelete: 'CASCADE'
  })
  product: Product;
} 