import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './users.model';
import { UserService } from './user.service';
import { OwnerAuthGuard } from '@auth/guards/owner.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private userService: UserService
  ) { }

  // @ApiOperation({ summary: 'Create new users' })
  // @ApiResponse({ status: 200, type: User })
  // @Post()
  // create(@Body() userDto: CreateUserDto) {
  //   return this.userService.create(userDto)
  // }

  @UseGuards(OwnerAuthGuard)
  @ApiOperation({ summary: 'Get all registered users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.userService.getAll()
  }
}
