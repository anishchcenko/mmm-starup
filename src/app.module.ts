import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from './users/users.module';
import { User } from './users//users.model';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsIncome } from '@transactions/transactions-income.model';
import { TransactionsOutcome } from '@transactions/transactions-outcome.model';
import { ReferralsModule } from './referrals/referrals.module';
import { Referrals } from './referrals/referrals.model';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB,
      models: [User, TransactionsIncome, TransactionsOutcome, Referrals],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    ReferralsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
