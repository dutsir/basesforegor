import { Column, DataType, Model, Table, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './product.model';

@Table({
  tableName: 'CATEGORIES',
  timestamps: false
})
export class Category extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'PARENT_CATEGORY_ID'
  })
  parent_category_id: number;

  @HasMany(() => Product, {
    foreignKey: 'category_id',
    sourceKey: 'category_id'
  })
  products: Product[];

  @BelongsTo(() => Category)
  parentCategory: Category;

  @HasMany(() => Category)
  childCategories: Category[];
} 