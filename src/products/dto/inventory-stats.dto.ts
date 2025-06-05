import { ApiProperty } from '@nestjs/swagger';

export class LowStockProductDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Название товара', example: 'Смартфон iPhone 13' })
  name: string;

  @ApiProperty({ description: 'Текущий запас', example: 5 })
  current_stock: number;

  @ApiProperty({ description: 'Минимальный рекомендуемый запас', example: 10 })
  min_stock: number;
}

export class InventoryStatsDto {
  @ApiProperty({ description: 'Общее количество товаров', example: 1000 })
  total_products: number;

  @ApiProperty({ description: 'Общая стоимость запасов', example: 500000 })
  total_value: number;

  @ApiProperty({ description: 'Количество товаров с низким запасом', example: 10 })
  low_stock_count: number;

  @ApiProperty({ description: 'Количество недоступных товаров', example: 5 })
  out_of_stock_count: number;

  @ApiProperty({ description: 'Средняя цена товара', example: 500 })
  average_price: number;

  @ApiProperty({ description: 'Товары с низким запасом', type: [LowStockProductDto] })
  low_stock_products: LowStockProductDto[];
} 