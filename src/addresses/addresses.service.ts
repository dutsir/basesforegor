import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from '../models/address.model';
import { User } from '../models/user.model';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<Address[]> {
    try {
      this.logger.log('Ищу все адреса...');
      const addresses = await this.addressModel.findAll();
      
      return addresses;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске адресов:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Address> {
    try {
      this.logger.log(`Ищу адрес с id: ${id}...`);
      const address = await this.addressModel.findByPk(id);
      if (!address) {
        this.logger.warn(`Адрес с id ${id} не найден 😢`);
        throw new Error('Адрес не найден');
      }
      return address;
    } catch (error) {
      this.logger.error(`Ой, что-то пошло не так при поиске адреса ${id}:`, error);
      throw error;
    }
  }

  async create(addressData: Partial<Address>): Promise<Address> {
    try {
      this.logger.log('Создаю новый адрес...');
      const address = await this.addressModel.create(addressData);
      this.logger.log(`Ура! Создан адрес с id: ${(address as any).address_id} 🎉`);
      return address;
    } catch (error) {
      this.logger.error('Ой, что-то пошло не так при создании адреса:', error);
      throw error;
    }
  }

  async update(id: number, addressData: Partial<Address>): Promise<[number, Address[]]> {
    try {
      this.logger.log(`Обновляю адрес ${id}...`);
      const result = await this.addressModel.update(addressData, {
        where: { address_id: id },
        returning: true,
      });
      this.logger.log(`Готово! Адрес ${id} обновлен ✨`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при обновлении адреса ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    try {
      this.logger.log(`Удаляю адрес ${id}...`);
      const result = await this.addressModel.destroy({
        where: { address_id: id },
      });
      this.logger.log(`Адрес ${id} удален 👋`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при удалении адреса ${id}:`, error);
      throw error;
    }
  }

  async getUserAddresses(userId: number): Promise<Address[]> {
    try {
      this.logger.log(`Ищу адреса пользователя ${userId}...`);
      const addresses = await this.addressModel.findAll({
        where: { user_id: userId }
      });
      
      return addresses;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске адресов пользователя ${userId}:`, error);
      throw error;
    }
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<void> {
    try {
      this.logger.log(`Устанавливаю адрес ${addressId} как основной для пользователя ${userId}...`);
      
      await this.addressModel.update(
        { is_default: false },
        { where: { user_id: userId } }
      );

      await this.addressModel.update(
        { is_default: true },
        { where: { address_id: addressId, user_id: userId } }
      );

      this.logger.log(`Готово! Адрес ${addressId} теперь основной для пользователя ${userId} ⭐`);
    } catch (error) {
      this.logger.error(` что-то пошло не так при установке основного адреса:`, error);
      throw error;
    }
  }
} 