import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param } from '@nestjs/common';
import { PermissionsGuard, RequirePermissions } from '../guards/permissions.guard';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  @Post()
  @RequirePermissions('create') // Only users with create permission can access
  createUser(@Body() createUserDto: any) {
    return 'User created';
  }

  @Get(':id')
  @RequirePermissions('read') // Read permission required
  getUser(@Param('id') id: string) {
    return `User data for ID ${id}`;
  }

  @Put(':id')
  @RequirePermissions('update') // Update permission required
  updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return `User with ID ${id} updated`;
  }

  @Delete(':id')
  @RequirePermissions('delete') // Delete permission required
  deleteUser(@Param('id') id: string) {
    return `User with ID ${id} deleted`;
  }
}
