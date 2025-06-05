import { ApiProperty } from '@nestjs/swagger';

export class SalesStatisticsDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Название товара', example: 'Смартфон iPhone 13' })
  name: string;

  @ApiProperty({ description: 'Общее количество проданных единиц', example: 150 })
  total_sold: number;

  @ApiProperty({ description: 'Общая выручка', example: 149998.50 })
  total_revenue: number;

  @ApiProperty({ description: 'Средняя цена продажи', example: 999.99 })
  average_price: number;
} 