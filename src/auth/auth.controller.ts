import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '@users/dto/create-user.dto';
import { UserResponseDto } from '@users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { RegReferralUserResponse } from './dto/reg-ref-user-res.dto';
import { RegUserResponseDto } from './dto/reg-user-res.dto';
import { UserLoginDto } from './dto/user-login.dto';

@ApiTags('Authorization')
@Controller('login')
export class AuthController {

  constructor(
    private authService: AuthService
  ) { }

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, type: RegUserResponseDto })
  @Post()
  login(@Body() user:UserLoginDto) {
    return this.authService.login(user)
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Post('/registration')
  registration(@Body() user) {
    return this.authService.registration(user)
  }

  @ApiOperation({ summary: 'Referral registration' })
  @ApiResponse({ status: 200, type: RegReferralUserResponse })
  @Post('/referral/:id')
  regReferral(@Param('id') hashEmail: string) {
    return this.authService.registrationReferral(hashEmail);
  }

}
