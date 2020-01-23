import { Logger } from '@hmcts/nodejs-logging'

import * as moment from 'moment'

import { FrequencyConversions } from 'common/frequency/frequencyConversions'
import { Frequency } from 'common/frequency/frequency'

import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { BankAccount } from 'claims/models/response/statement-of-means/bankAccount'
import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { Dependant } from 'claims/models/response/statement-of-means/dependant'
import { PriorityDebts } from 'claims/models/response/statement-of-means/priorityDebts'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { PartyType } from 'common/partyType'
import { Partner } from 'claims/models/response/statement-of-means/partner'
import { AllowanceCalculations } from 'common/allowances/allowanceCalculations'

const logger = Logger.getLogger('common/statement-of-means')

export class StatementOfMeansCalculations {

  constructor (public allowanceCalculations?: AllowanceCalculations) {}

  calculateTotalMonthlyDisposableIncome (statementOfMeans: StatementOfMeans,
                                         defendantType: string,
                                         defendantDateOfBirth: moment.Moment): number {

    const defendantAge = moment().diff(moment(defendantDateOfBirth), 'years')
    const totalMonthlyIncome: number = this.calculateTotalMonthlyIncome(statementOfMeans) || 0
    const totalMonthlyExpense: number = this.calculateTotalMonthlyExpense(statementOfMeans) || 0

    let totalMonthlyAllowance: number = 0
    if (this.allowanceCalculations) {
      totalMonthlyAllowance = defendantType === PartyType.INDIVIDUAL.value ?
        this.calculateTotalMonthlyAllowances(statementOfMeans, defendantAge) || 0 : 0
    }

    const totalMonthlyDisposableIncome = (totalMonthlyIncome - totalMonthlyExpense) - totalMonthlyAllowance
    logger.info('Monthly disposable income calculation: ', totalMonthlyDisposableIncome)
    return totalMonthlyDisposableIncome
  }

  calculateTotalMonthlyExpense (statementOfMeans: StatementOfMeans): number {
    const monthlyDebts: number = statementOfMeans.debts ? this.calculateMonthlyDebts(statementOfMeans.debts) : 0

    const monthlyPriorityDebts: number = statementOfMeans.priorityDebts ? this.calculateMonthlyPriorityDebts(statementOfMeans.priorityDebts) : 0
    const monthlyCourtOrders: number = statementOfMeans.courtOrders ? this.calculateMonthlyCourtOrders(statementOfMeans.courtOrders) : 0
    const monthlyRegularExpense: number = statementOfMeans.expenses ? this.calculateMonthlyRegularExpense(statementOfMeans.expenses) : 0

    const totalMonthlyExpense = monthlyDebts + monthlyPriorityDebts + monthlyCourtOrders + monthlyRegularExpense

    logger.debug('Monthly expense calculation: ', totalMonthlyExpense)
    return totalMonthlyExpense
  }

  calculateTotalMonthlyAllowances (statementOfMeans: StatementOfMeans, defendantAge: number): number {

    const monthlyLivingAllowance: number = this.allowanceCalculations.getMonthlyLivingAllowance(defendantAge,
      statementOfMeans.partner)
    const monthlyDependantsAllowance: number = this.allowanceCalculations.getMonthlyDependantsAllowance(statementOfMeans.dependant)
    const monthlyPensionerAllowance: number = this.allowanceCalculations.getMonthlyPensionerAllowance(statementOfMeans.incomes,
      statementOfMeans.partner)
    const monthlyDisabilityAllowance: number = this.calculateMonthlyDisabilityAllowance(statementOfMeans.dependant,
      statementOfMeans.carer, statementOfMeans.disability, statementOfMeans.partner)
    const totalMonthlyAllowance = monthlyLivingAllowance + monthlyDependantsAllowance + monthlyPensionerAllowance +
      monthlyDisabilityAllowance
    logger.debug('Monthly allowance calculation: ', totalMonthlyAllowance)
    return totalMonthlyAllowance
  }

  calculateMonthlyDisabilityAllowance (dependant: Dependant, carer: boolean, defendantDisability: DisabilityStatus,
                                       partner: Partner): number {
    if (defendantDisability === DisabilityStatus.NO || defendantDisability === undefined) {
      return this.allowanceCalculations.getCarerDisableDependantAmount(dependant, carer)
    }
    return this.allowanceCalculations.getDisabilityAllowance(defendantDisability, partner)
  }

  calculateMonthlyDebts (debts: Debt[]): number {

    const reducer = (total: number, debt: Debt) => {
      const monthlyPayments: number = debt.monthlyPayments

      if (!monthlyPayments) {
        return total
      }

      return total + monthlyPayments
    }

    const monthlyDebts = debts.reduce(reducer, 0)
    logger.debug('Monthly debts calculation: ', monthlyDebts)
    return monthlyDebts
  }

  calculateMonthlyCourtOrders (courtOrders: CourtOrder[]): number {

    const reducer = (total: number, courtOrder: CourtOrder) => {
      const monthlyInstalmentAmount: number = courtOrder.monthlyInstalmentAmount

      if (!monthlyInstalmentAmount || monthlyInstalmentAmount < 0) {
        return total
      }

      return total + monthlyInstalmentAmount
    }

    const monthlyCourtOrders = courtOrders.reduce(reducer, 0)
    logger.debug('Monthly Court orders calculation: ', monthlyCourtOrders)
    return monthlyCourtOrders
  }

  calculateMonthlyPriorityDebts (priorityDebts: PriorityDebts[]): number {
    const monthlyPriorityDebts: number = this.calculateMonthlyRegularIncomesExpensesOrDebts(priorityDebts)
    logger.debug('Monthly priority debts calculation: ', monthlyPriorityDebts)
    return monthlyPriorityDebts
  }

  calculateMonthlyRegularExpense (expenses: Expense[]): number {
    const monthlyRegularExpense = this.calculateMonthlyRegularIncomesExpensesOrDebts(
      expenses.filter(value => {
        return value.type === ExpenseType.RENT || value.type === ExpenseType.MORTGAGE
      })
    )
    logger.debug('Monthly regular expense calculation: ', monthlyRegularExpense)
    return monthlyRegularExpense
  }

  calculateTotalMonthlyIncome (statementOfMeans: StatementOfMeans): number {
    const monthlyRegularIncome = statementOfMeans.incomes ? this.calculateMonthlyRegularIncome(statementOfMeans.incomes) : 0
    const monthlySelfEmployedTurnover = statementOfMeans.employment ? this.calculateMonthlySelfEmployedTurnover(statementOfMeans.employment) : 0
    const monthlySavings = this.calculateMonthlySavings(statementOfMeans.bankAccounts, monthlyRegularIncome)
    const totalMonthlyIncome = monthlySelfEmployedTurnover + monthlySavings + monthlyRegularIncome
    logger.debug('Monthly income calculation: ', totalMonthlyIncome)
    return totalMonthlyIncome
  }

  calculateMonthlySelfEmployedTurnover (employment: Employment): number {
    if (!employment.selfEmployment || !employment.selfEmployment.annualTurnover) {
      return 0
    }

    const monthlySelfEmployedTurnover = employment.selfEmployment.annualTurnover / 12
    logger.debug('Monthly self employed turnover: ', monthlySelfEmployedTurnover)
    return monthlySelfEmployedTurnover
  }

  calculateMonthlySavings (bankAccounts: BankAccount[], monthlyRegularIncome: number): number {
    if (!bankAccounts) {
      return 0
    }
    const reducer = (total: number, bankAccount: BankAccount) => {
      const balance: number = bankAccount.balance

      if (!balance || balance < 0) {
        return total
      }

      return total + balance
    }

    const savings: number = bankAccounts.reduce(reducer, 0)
    const savingsInExcess = savings - (monthlyRegularIncome * 1.5)

    if (savingsInExcess < 0) {
      return 0
    }

    const monthlySavings = savingsInExcess / 12
    logger.debug('Monthly savings calculation: ', monthlySavings)
    return monthlySavings
  }

  calculateMonthlyRegularIncome (incomes: Income[]): number {
    const monthlyRegularIncome = this.calculateMonthlyRegularIncomesExpensesOrDebts(incomes)
    logger.debug('Monthly regular income calculation: ', monthlyRegularIncome)
    return monthlyRegularIncome
  }

  private calculateMonthlyRegularIncomesExpensesOrDebts (incomesExpensesOrDebts: FrequencyBasedAmount[]): number {

    const reducer = (total: number, incomeExpenseOrDebt: FrequencyBasedAmount) => {
      const frequency: Frequency = this.toFrequency(incomeExpenseOrDebt.frequency)
      const amount: number = incomeExpenseOrDebt.amount

      if (!frequency || !amount) {
        return total
      }

      return total + FrequencyConversions.convertAmountToMonthly(amount, frequency)
    }

    return incomesExpensesOrDebts.reduce(reducer, 0)
  }

  private toFrequency (paymentFrequency: PaymentFrequency): Frequency {
    try {
      return Frequency.of(paymentFrequency)
    } catch (error) {
      return undefined
    }
  }
}
