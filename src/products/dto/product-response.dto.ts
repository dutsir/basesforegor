import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../models/category.model';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'ID категории', example: 1 })
  category_id: number;

  @ApiProperty({ description: 'Название товара', example: 'Смартфон iPhone 13' })
  name: string;

  @ApiProperty({ description: 'Описание товара', example: 'Новейший смартфон с отличной камерой', required: false })
  description?: string;

  @ApiProperty({ description: 'Цена товара', example: 999.99 })
  price: number;

  @ApiProperty({ description: 'Количество на складе', example: 100 })
  stock_quantity: number;

  @ApiProperty({ description: 'URL изображения товара', example: 'https://example.com/iphone13.jpg', required: false })
  image_url?: string;

  @ApiProperty({ description: 'Вес товара', example: 0.5, required: false })
  weight?: number;

  @ApiProperty({ description: 'Размеры товара', example: '10x5x1 см', required: false })
  dimensions?: string;

  @ApiProperty({ description: 'Доступность товара', example: true })
  is_available: boolean;

  @ApiProperty({ type: () => Category, description: 'Категория товара' })
  category?: Category;

  @ApiProperty({ description: 'Дата создания', example: '2024-05-30T12:00:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-05-30T12:00:00Z' })
  updated_at: Date;
} 