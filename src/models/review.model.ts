import { Column, DataType, Model, Table, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Product } from './product.model';
import { User } from './user.model';

@Table({
  tableName: 'REVIEWS',
  timestamps: false,
  indexes: [
    {
      name: 'idx_reviews_product',
      fields: ['product_id']
    },
    {
      name: 'idx_reviews_user_product',
      fields: ['user_id', 'product_id']
    }
  ]
})
export class Review extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'REVIEW_ID'
  })
  review_id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'PRODUCT_ID'
  })
  product_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'USER_ID'
  })
  user_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'RATING',
    validate: {
      min: 1,
      max: 5
    }
  })
  rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'COMMENT'
  })
  comment: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'REVIEW_DATE'
  })
  review_date: Date;

  @BelongsTo(() => Product, {
    onDelete: 'CASCADE'
  })
  product: Product;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE'
  })
  user: User;
} 