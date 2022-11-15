import { AuthModule } from '@auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsIncome } from '@transactions/transactions-income.model';
import { TransactionsOutcome } from '@transactions/transactions-outcome.model';
import { Referrals } from 'src/referrals/referrals.model';

import { UserService } from './user.service';
import { UsersController } from './users.controller';
import { User } from './users.model';

@Module({
  providers: [UserService],
  controllers: [UsersController],
  imports: [
    forwardRef(() =>AuthModule),
    SequelizeModule.forFeature([User, TransactionsIncome, TransactionsOutcome, Referrals]),
  ],
  exports: [UserService]
})
export class UsersModule { }
