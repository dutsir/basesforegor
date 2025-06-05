import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'ID категории', example: 1 })
  @IsNumber()
  category_id: number;

  @ApiProperty({ description: 'Название товара', example: 'Смартфон iPhone 13' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Описание товара', example: 'Новейший смартфон с отличной камерой', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Цена товара', example: 999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Количество на складе', example: 100 })
  @IsNumber()
  @Min(0)
  stock_quantity: number;

  @ApiProperty({ description: 'URL изображения товара', example: 'https://example.com/iphone13.jpg', required: false })
  @IsUrl()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ description: 'Вес товара', example: 0.5, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: 'Размеры товара', example: '10x5x1 см', required: false })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiProperty({ description: 'Доступность товара', example: true })
  @IsBoolean()
  is_available: boolean;
} 