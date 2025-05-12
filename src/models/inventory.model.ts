import { Column, DataType, Model, Table, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Product } from './product.model';
import { Warehouse } from './warehouse.model';

@Table({
  tableName: 'INVENTORY',
  timestamps: false,
  indexes: [
    {
      name: 'idx_inventory_product',
      fields: ['product_id']
    },
    {
      name: 'idx_inventory_warehouse',
      fields: ['warehouse_id']
    }
  ]
})
export class Inventory extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'INVENTORY_ID'
  })
  inventory_id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'PRODUCT_ID'
  })
  product_id: number;

  @ForeignKey(() => Warehouse)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'WAREHOUSE_ID'
  })
  warehouse_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'QUANTITY',
    validate: {
      min: 0
    }
  })
  quantity: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'LAST_RESTOCK_DATE'
  })
  last_restock_date: Date;

  @BelongsTo(() => Product, {
    onDelete: 'CASCADE'
  })
  product: Product;

  @BelongsTo(() => Warehouse, {
    onDelete: 'CASCADE'
  })
  warehouse: Warehouse;
} 