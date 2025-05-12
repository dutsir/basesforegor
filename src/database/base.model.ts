import { Model, DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export class BaseModel extends Model {
  public id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const baseModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}; 