import { ApiProperty } from '@nestjs/swagger';

export class SalesAndInventoryStatsResult {
  @ApiProperty({ description: 'ID товара', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Название товара', example: 'Смартфон' })
  name: string;

  @ApiProperty({ description: 'Общее количество проданных единиц за период', example: 100 })
  total_sold: number;

  @ApiProperty({ description: 'Общий текущий запас на складах', example: 50 })
  total_stock: number;

  // @ApiProperty({ description: 'Общая выручка за период', example: 15000.00 })
  // total_revenue?: number; // Uncomment if total_revenue is included
} 