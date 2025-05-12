import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('test')
  createTestUser(): Promise<User> {
    return this.usersService.createTestUser();
  }

  @Get('top-spenders')
  getTopSpendingUsers() {
    return this.usersService.getTopSpendingUsers();
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() newUser: Partial<User>) {
    return this.usersService.create(newUser);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedUser: Partial<User>) {
    return this.usersService.update(+id, updatedUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
} 