import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';

@Table({
  tableName: 'CART_ITEMS',
  timestamps: false,
})
export class CartItem extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'CART_ITEM_ID'
  })
  cart_item_id: number;

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
    type: DataType.INTEGER,
    allowNull: false,
    field: 'QUANTITY',
    validate: {
      min: 1
    }
  })
  quantity: number;

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
    foreignKey: 'product_id',
    targetKey: 'product_id'
  })
  product: Product;
} 