import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Inventory } from './inventory.model';

@Table({
  tableName: 'WAREHOUSES',
  timestamps: false
})
export class Warehouse extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'WAREHOUSE_ID'
  })
  warehouse_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'NAME'
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'ADDRESS'
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'PHONE'
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'MANAGER_NAME'
  })
  manager_name: string;

  @HasMany(() => Inventory, {
    onDelete: 'CASCADE'
  })
  inventory: Inventory[];
} 