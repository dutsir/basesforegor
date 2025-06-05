import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Название категории', example: 'Electronics' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Описание категории', example: 'Electronic gadgets and devices', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 