import { HttpException, HttpStatus, Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '@users/user.service';

import { ReferralsService } from 'src/referrals/referrals.service';
import { BalanceDto } from './dto/balance.dto';
import { BalanceOwnerDto } from './dto/balanceOwner.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionsIncome } from './transactions-income.model';
import { TransactionsOutcome } from './transactions-outcome.model';

@Injectable()
export class TransactionsService {

  private refToUserCoefficient: number = 0.1
  private investorCoefficient: number = 0.01

  constructor(
    @InjectModel(TransactionsIncome) private transactionInBase: typeof TransactionsIncome,
    @InjectModel(TransactionsOutcome) private transactionOutBase: typeof TransactionsOutcome,
    private userService: UserService,
    private referralsService: ReferralsService
  ) { }

  async createIncomePayment(reqUser, payInfo: CreateTransactionDto) {
    try {
      const investment = await this.transactionInBase.create({ ...payInfo, userId: reqUser.id, currency: 'USD' });
      const income_count = await this.transactionInBase.count({ where: { userId: reqUser.id } })
      if (income_count) {
        await this.userService.updateUserField(reqUser.id, 'income_count', income_count)
        if (income_count >= 1 && reqUser.role === "Guest") this.userService.becomeInvestor(reqUser.id)
      }
      return investment
    } catch {
      // console.log(e)
      throw new HttpException('Error', HttpStatus.BAD_REQUEST)
    }
  }

  private async createOutcomePayment(reqUser, payInfo: TransactionDto) {
    const withdraw = await this.transactionOutBase.create(payInfo);
    const outcome_count = (await this.getAllOutcomeTransactions(reqUser)).length
    if (outcome_count) {
      await this.userService.updateUserField(reqUser.id, 'outcome_count', outcome_count)
    }
    return withdraw
  }

  async payUserAllowedProfit(reqUser, expectSum: CreateTransactionDto) {
    const myBalance = await this.calcActualTotalProfit(reqUser)
    if (!myBalance || myBalance < expectSum.value) {
      throw new HttpException('Not enough money', HttpStatus.BAD_REQUEST)
    }
    const data = await this.createOutcomePayment(reqUser, { value: expectSum.value, currency: 'USD', userId: reqUser.id })
    return data
  }

  async ownerWithdrawAllMoney(reqUser) {
    const allIncomeTransactions = await this.transactionInBase.sum('value')
    const allOutcomeTransactions = await this.transactionOutBase.sum('value')
    const ownerWithdraw = allIncomeTransactions - allOutcomeTransactions
    if (ownerWithdraw) {
      this.createOutcomePayment(reqUser, { value: ownerWithdraw, currency: 'USD', userId: reqUser.id })
    }
    return ownerWithdraw
  }

  private async getAllOutcomeTransactions(reqUser) {
    const allTransactions = await this.transactionOutBase.findAll({ where: { userId: reqUser.id } })
    return allTransactions
  }

  private calcTransactionDailyProfit(transaction) {
    //принимаем инстанс транзакции, берем тек дату и CreatedAt транзакции, полученное кол-во дней считаем на 1% от суммі 
    let investorDailyProfit: number = 0
    const currentDate = new Date()
    const paymentDate = new Date(String(transaction.createdAt))
    // const paymentDate = new Date('2022-11-23T17:53:05.779Z')
    // @ts-ignore
    const diffDays = Math.round(Math.abs((currentDate - paymentDate) / (24 * 60 * 60 * 1000)));
    investorDailyProfit = transaction.value * this.investorCoefficient * diffDays
    return investorDailyProfit
  }

  private async calcUserProfitTotal(reqUser) {
    const allMyPayments = await this.transactionInBase.findAll({ where: { userId: reqUser.id } });
    let myTotalProfit = allMyPayments.reduce((acc: number, curr) => {
      const itemProf = this.calcTransactionDailyProfit(curr.dataValues)
      // console.log(itemProf, 'itemProf')
      return acc += itemProf
    }, 0)
    return myTotalProfit
  }

  async calcUserInvestTotal(reqUser) {
    const allMyPayments = await this.transactionInBase.findAll({ where: { userId: reqUser.id } });
    let myTotalInvestSum = allMyPayments.reduce((acc: number, curr) => acc = acc + curr.value, 0)
    return myTotalInvestSum
  }

  async calcReferralsProfitTotal(reqUser): Promise<number> {
    let totalFromRefProfit = 0
    const currentUser = await this.userService.getUserById(reqUser.id)

    if (currentUser.referrals_count) {
      const allJoinedReferrals = await this.referralsService.getAllMyReferrals(currentUser)
      // @ts-ignore
      totalFromRefProfit = await allJoinedReferrals.reduce(async (acc: number, item) => {
        const refProf = await this.calcUserProfitTotal({ ...item, id: item.userId })
        return acc = + refProf
      }, 0)
    }
    return totalFromRefProfit // Сколько всего заработали рефералы 
  }

  async calcActualTotalProfit(reqUser) {
    const currentUser = await this.userService.getUserById(reqUser.id)
    const fromMyInvests = await this.calcUserProfitTotal(reqUser)
    let fromReferrals = 0
    let myWithdraws = 0
    if (currentUser.referrals_count) {
      fromReferrals = await this.calcReferralsProfitTotal(reqUser) * this.refToUserCoefficient
    }
    if (currentUser.outcome_count) {
      const allWithdrawsTransition = await this.getAllOutcomeTransactions(reqUser)
      myWithdraws = allWithdrawsTransition.reduce((acc, item) => acc + item.value, 0)
    }
    return (fromMyInvests + fromReferrals) - myWithdraws  // сколько денег доступно для снятия 
  }

  async getBalance(reqUser): Promise<BalanceDto> {
    const allMyPayments = await this.transactionInBase.findAll({ where: { userId: reqUser.id } })
    const my_invest_count = await this.transactionInBase.count({ where: { userId: reqUser.id } })
    const invest_sum = await this.calcUserInvestTotal(reqUser)
    const total_profit = await this.calcActualTotalProfit(reqUser)
    const profit_my_invest = await this.calcUserProfitTotal(reqUser)
    const my_ref_found = await this.calcReferralsProfitTotal(reqUser)
    const my_profit_ref = my_ref_found * this.refToUserCoefficient

    return {
      my_invest_count,
      invest_sum,
      profit_my_invest,
      my_ref_found,
      my_profit_ref,
      total_profit,
      invests: allMyPayments
    }
  }

  async getOwnerBalance(): Promise<BalanceOwnerDto> {
    const allInPayments = await this.transactionInBase.count()
    const allOutPayments = await this.transactionOutBase.count()
    const inSum = await this.transactionInBase.sum('value')
    const outSum = await this.transactionOutBase.sum('value')

    return {
      income_count: allInPayments,
      incomes: inSum,
      outcome_count: allOutPayments,
      outcomes: outSum,
      balance: inSum - outSum,
      currency: 'US Dollars'
    }
  }

}
