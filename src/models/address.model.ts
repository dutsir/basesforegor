import { Column, DataType, Model, Table, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'ADDRESSES',
  timestamps: false,
  indexes: [
    {
      name: 'idx_addresses_user',
      fields: ['user_id']
    },
    {
      name: 'idx_addresses_default',
      fields: ['user_id', 'is_default'],
      where: {
        is_default: true
      }
    }
  ]
})
export class Address extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ADDRESS_ID'
  })
  address_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'USER_ID'
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'COUNTRY'
  })
  country: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'CITY'
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'STREET'
  })
  street: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'HOUSE_NUMBER'
  })
  house_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'APARTMENT'
  })
  apartment: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'POSTAL_CODE'
  })
  postal_code: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'IS_DEFAULT'
  })
  is_default: boolean;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE'
  })
  user: User;
} 