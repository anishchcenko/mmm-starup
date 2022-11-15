import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserService } from '@users/user.service';
import { User } from '@users/users.model';
import { ReferralsService } from 'src/referrals/referrals.service';
import { CreateRefDto } from 'src/referrals/dto/create-ref.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { RegUserResponseDto } from './dto/reg-user-res.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private referralsService: ReferralsService
  ) { }

  async login(user: UserLoginDto) {
    const loginedUser = await this.checkkUser(user);
    return this.generateToken(loginedUser)
  }

  async registration(user: CreateUserDto) {
    const candidateToRegister = await this.userService.getUserByEmail(user.email)
    if (candidateToRegister) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(user.password, 11)
    const registeredUser = await this.userService.create({ ...user, password: hashPassword, role: 'Guest' })
    return this.generateToken(registeredUser)
  }

  private async generateToken(user: User):Promise<RegUserResponseDto> {
    const payload = { id: user.id, email: user.email, password: user.password, role: user.role }
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async checkkUser(user: UserLoginDto) {
    const existenUser = await this.userService.getUserByEmail(user.email)
    const passwordMatched = await bcrypt.compare(user.password, existenUser.password)
    if (existenUser && passwordMatched) {
      return existenUser
    }
    throw new UnauthorizedException({ message: "Invalid password" })
  }

  async registrationReferral(hashEmail: string) {
    const item: CreateRefDto = await this.referralsService.findItemByHash(hashEmail)
    if (!item.email) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }

    const password = '1234'
    const userDto: CreateUserDto = {
      email: item.email,
      refToUser: item.invitedById,
      password
    }
    const tokenNewUser = await this.registration(userDto)

    if (tokenNewUser) {
      await this.referralsService.updateReferralField(item.id, 'isJoined', true)
      const newUser = await this.userService.getUserByEmail(item.email)
      await this.referralsService.updateReferralField(item.id, 'userId', newUser.id)
      await this.userService.updateUserField(item.invitedById, 'referrals_count', +1)
    }
    return { item, tokenNewUser, password }
  }
}
