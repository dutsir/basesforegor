import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Category } from './category.model';
import { CartItem } from './cart-item.model';
import { OrderDetail } from './order-detail.model';
import { Review } from './review.model';
import { Wishlist } from './wishlist.model';
import { Inventory } from './inventory.model';

@Table({
  tableName: 'PRODUCTS',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'PRODUCT_ID'
  })
  product_id: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'CATEGORY_ID'
  })
  category_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'NAME'
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'DESCRIPTION'
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'PRICE'
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'STOCK_QUANTITY'
  })
  stock_quantity: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'IMAGE_URL'
  })
  image_url: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    field: 'WEIGHT'
  })
  weight: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'DIMENSIONS'
  })
  dimensions: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'IS_AVAILABLE'
  })
  is_available: boolean;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => CartItem)
  cartItems: CartItem[];

  @HasMany(() => OrderDetail)
  orderDetails: OrderDetail[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Wishlist)
  wishlistItems: Wishlist[];

  @HasMany(() => Inventory)
  inventory: Inventory[];
} 