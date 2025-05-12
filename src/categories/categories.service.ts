import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async findAll(): Promise<Category[]> {
    try {
      this.logger.log('Ищу все категории...');
      const categories = await this.categoryModel.findAll();
      this.logger.log(`Вот ${categories.length} категорий! 🎯`);
      return categories;
    } catch (error) {
      this.logger.error(' что-то пошло не так при поиске категорий:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      this.logger.log(`Ищу категорию с id: ${id}...`);
      const category = await this.categoryModel.findByPk(id);
      if (!category) {
        this.logger.warn(`Категория с id ${id} не найдена 😢`);
        throw new Error('Категория не найдена');
      }
      return category;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске категории ${id}:`, error);
      throw error;
    }
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    try {
      this.logger.log('Создаю новую категорию...');
      const category = await this.categoryModel.create(categoryData);
      this.logger.log(`Ура! Создана категория с id: ${category.category_id} 🎉`);
      return category;
    } catch (error) {
      this.logger.error('что-то пошло не так при создании категории:', error);
      throw error;
    }
  }

  async update(id: number, categoryData: Partial<Category>): Promise<[number, Category[]]> {
    try {
      this.logger.log(`Обновляю категорию ${id}...`);
      const result = await this.categoryModel.update(categoryData, {
        where: { category_id: id },
        returning: true,
      });
      this.logger.log(`Готово! Категория ${id} обновлена ✨`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при обновлении категории ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    try {
      this.logger.log(`Удаляю категорию ${id}...`);
      const result = await this.categoryModel.destroy({
        where: { category_id: id },
      });
      this.logger.log(`Категория ${id} удалена 👋`);
      return result;
    } catch (error) {
      this.logger.error(` что-то пошло не так при удалении категории ${id}:`, error);
      throw error;
    }
  }

  async getCategoryWithProducts(id: number): Promise<Category> {
    try {
      this.logger.log(`Ищу категорию ${id} с товарами...`);
      const category = await this.categoryModel.findByPk(id, {
        include: [{
          model: Product,
          as: 'products'
        }]
      });
      if (!category) {
        this.logger.warn(`Категория с id ${id} не найдена 😢`);
        throw new Error('Категория не найдена');
      }
      this.logger.log(`ВООТ ${category.products.length} товаров в категории! 📦`);
      return category;
    } catch (error) {
      this.logger.error(` что-то пошло не так при поиске категории ${id} с товарами`, error);
      throw error;
    }
  }
} 