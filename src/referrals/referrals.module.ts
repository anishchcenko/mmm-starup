import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@auth/auth.module';

import { User } from '@users/users.model';
import { ReferralsController } from './referrals.controller';
import { Referrals } from './referrals.model';
import { ReferralsService } from './referrals.service';

@Module({
  controllers: [ReferralsController],
  providers: [ReferralsService],
  imports: [
    forwardRef(() =>AuthModule),
    SequelizeModule.forFeature([ Referrals , User]),
  ],
  exports: [ReferralsService]
})
export class ReferralsModule {}
