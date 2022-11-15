import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@users/users.model';
import { TransactionsController } from './transactions.controller';
import { TransactionsIncome } from './transactions-income.model';
import { TransactionsService } from './transactions.service';
import { TransactionsOutcome } from './transactions-outcome.model';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { ReferralsModule } from 'src/referrals/referrals.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    SequelizeModule.forFeature([TransactionsIncome, TransactionsOutcome, User]),
    AuthModule,
    UsersModule,
    ReferralsModule
  ],
})
export class TransactionsModule {}
