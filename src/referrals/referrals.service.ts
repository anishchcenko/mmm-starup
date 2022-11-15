import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { CreateRefDto } from './dto/create-ref.dto';
import { GenRefDto } from './dto/gen-ref.dto';
import { Referrals } from './referrals.model';

@Injectable()
export class ReferralsService {

  constructor(
    @InjectModel(Referrals) private referralsBase: typeof Referrals,
  ) { }

  private async genHesh(email: string) {
    const hashEmail = await bcrypt.hash(email, Number(process.env.SALT))
    return hashEmail
  }

  async getAllMyReferrals(currUser) {
    const allMyReferrals = await this.referralsBase.findAll({
      where: {
        invitedById: currUser.id,
        isJoined: true
      }
    })
    return allMyReferrals
  }

  async genReferralLink(reqUser, genLinkDto: GenRefDto) {
    const existingReferall = await this.referralsBase.findOne({
      where: { email: genLinkDto.email },
    })

    if (existingReferall) {
      throw new UnauthorizedException({ message: "user alredy exist" })
    }

    const hash = await this.genHesh(genLinkDto.email)
    const createDto: CreateRefDto = {
      email: genLinkDto.email,
      hashValue: hash,
      invitedById: reqUser.id,
      isJoined: false
    }
    const referal = await this.referralsBase.create(createDto)
    return { inviteURL: `http://localhost:7000/api/login/referral/${hash}` }
  }

  async findItemByHash(hash: string) {
    const item = await this.referralsBase.findOne({
      where: { hashValue: hash },
      // include: { all: true }
    })
    return item
  }

  async updateReferralField(rowId: number, key, value) {
    const referral = await this.referralsBase.findByPk(rowId)
    await referral.set(key, value).save()
    return referral
  }
}
