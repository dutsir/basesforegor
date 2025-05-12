import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { CartItem } from './cart-item.model';
import { Address } from './address.model';
import { Order } from './order.model';
import { Review } from './review.model';
import { Wishlist } from './wishlist.model';

@Table({
  tableName: 'USERS',
  timestamps: false,
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'USER_ID'
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'EMAIL',
    validate: {
      isEmail: true,
      pattern: /^[^@]+@[^@]+\.[^@]+$/
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'PASSWORD_HASH'
  })
  password_hash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'FIRST_NAME'
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'LAST_NAME'
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'PHONE'
  })
  phone: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'REGISTRATION_DATE'
  })
  registration_date: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'IS_ADMIN'
  })
  is_admin: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'LAST_LOGIN_DATE'
  })
  last_login_date: Date;

  @HasMany(() => CartItem)
  cartItems: CartItem[];

  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Wishlist)
  wishlistItems: Wishlist[];
} 