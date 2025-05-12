import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as path from 'path';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../../labe_trytwo.sqlite'),
  autoLoadModels: true,
  synchronize: false, 
  logging: console.log, }