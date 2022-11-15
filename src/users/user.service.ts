import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User) private userBase: typeof User
  ) { }

  async create(dto: CreateUserDto) {
    if (await this.getUserByEmail(dto.email)) {
      throw new UnauthorizedException({ message: "user alredy exist" })
    }
    const user = await this.userBase.create(dto);
    return user
  }

  async getAll() {
    const users = await this.userBase.findAll({ include: { all: true } })
    // const users = await this.userBase.findAll({include:[TransactionsIncome]})
    return users
  }

  async getUserByEmail(email: string) {
    const user = await this.userBase.findOne({
      where: { email },
      include: { all: true }
    })
    return user
  }

  async getUserById(id: number) {
    const user = await this.userBase.findByPk(id)
    return user
  }

  async updateUserField(userId: number, key, value) {
    const user = await this.userBase.findByPk(userId)
    await user.set(key, value).save()
    return user
  }

  becomeInvestor(userId: number) {
    this.updateUserField(userId, 'role', 'Investor')
  }

  becomeRefTo(userId: number, inviterUserId: number) {
    this.updateUserField(userId, 'refToUser', inviterUserId)
  }





}
