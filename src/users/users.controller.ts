import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Создать тестового пользователя' })
  @ApiResponse({ status: 201, type: User, description: 'Тестовый пользователь успешно создан' })
  @Post('test')
  createTestUser(): Promise<User> {
    return this.usersService.createTestUser();
  }

  @ApiOperation({ summary: 'Получить самых щедрых покупателей' })
  @ApiResponse({ status: 200, description: 'Список самых щедрых покупателей успешно получен' })
  @Get('top-spenders')
  getTopSpendingUsers() {
    return this.usersService.getTopSpendingUsers();
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [User], description: 'Список пользователей успешно получен' })
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiBody({ type: User })
  @ApiResponse({ status: 201, type: User, description: 'Пользователь успешно создан' })
  @Post()
  create(@Body() newUser: Partial<User>) {
    return this.usersService.create(newUser);
  }

  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, type: User, description: 'Пользователь успешно найден' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
  @ApiBody({ type: User })
  @ApiResponse({ status: 200, type: [User], description: 'Пользователь успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedUser: Partial<User>) {
    return this.usersService.update(+id, updatedUser);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
} 