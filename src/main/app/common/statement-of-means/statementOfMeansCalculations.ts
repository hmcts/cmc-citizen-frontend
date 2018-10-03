///<reference path="../../../../../node_modules/@types/node/index.d.ts"/>
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
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { AgeGroupType, Child, Dependant } from 'claims/models/response/statement-of-means/dependant'
import { PriorityDebts } from 'claims/models/response/statement-of-means/priorityDebts'
import { Allowance, AllowanceItem } from 'claims/models/response/statement-of-means/allowance'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { PartyType } from 'common/partyType'
import { Partner } from 'claims/models/response/statement-of-means/partner'

const logger = Logger.getLogger('common/statement-of-means')

export class StatementOfMeansCalculations {
  private readonly allowancesLookup: Allowance
  private readonly defendantType: string
  private readonly defendantDateOfBirth: moment.Moment

  constructor (defendantType: string, defendantDateOfBirth: moment.Moment, allowancesLookup: Allowance) {
    this.allowancesLookup = allowancesLookup
    this.defendantType = defendantType
    this.defendantDateOfBirth = defendantDateOfBirth
  }

  calculateTotalMonthlyDisposableIncome (statementOfMeans: StatementOfMeans): number {

    const totalMonthlyIncome: number = this.calculateTotalMonthlyIncome(statementOfMeans) || 0
    const totalMonthlyExpense: number = this.calculateTotalMonthlyExpense(statementOfMeans) || 0
    let totalMonthlyAllowance: number = 0
    if (this.allowancesLookup) {
      totalMonthlyAllowance = this.defendantType === PartyType.INDIVIDUAL.value ?
        this.calculateTotalMonthlyAllowances(statementOfMeans) : 0
    }
    const totalMonthlyDisposableIncome = (totalMonthlyIncome - totalMonthlyExpense) - totalMonthlyAllowance
    logger.debug('Monthly disposable income calculation: ', totalMonthlyDisposableIncome)
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

  calculateTotalMonthlyAllowances (statementOfMeans: StatementOfMeans): number {

    const monthlyLivingAllowance: number = this.calculateMonthlyLivingAllowance(statementOfMeans.partner)
    const monthlyDependantsAllowance: number = this.calculateMonthlyDependantsAllowance(statementOfMeans.dependant)
    const monthlyPensionerAllowance: number = this.calculateMonthlyPensionerAllowance(statementOfMeans.incomes, statementOfMeans.partner)
    const monthlyDisabilityAllowance: number = this.calculateMonthlyDisabilityAllowance(statementOfMeans.dependant, statementOfMeans.carer, statementOfMeans.disability, statementOfMeans.partner)
    const totalMonthlyAllowance = monthlyLivingAllowance + monthlyDependantsAllowance + monthlyPensionerAllowance + monthlyDisabilityAllowance
    logger.debug('Monthly allowance calculation: ', totalMonthlyAllowance)
    return totalMonthlyAllowance
  }

  calculateMonthlyLivingAllowance (partner: Partner): number {
    const defendantAge: number = moment().diff(moment(this.defendantDateOfBirth), 'years')
    if (defendantAge < 18) {
      return 0
    }
    let filterOption = ''
    const personalLookup = this.allowancesLookup.personal
    if (!partner) {
      filterOption = defendantAge < 25 ? 'SINGLE_18_TO_24' : 'SINGLE_OVER_25'
    } else {
      if (partner.over18) {
        filterOption = 'DEFENDANT_AND_PARTNER_OVER_18'
      } else {
        filterOption = defendantAge < 25 ? 'DEFENDANT_UNDER_25_PARTNER_UNDER_18' : 'DEFENDANT_OVER_25_PARTNER_UNDER_18'
      }
    }
    return this.getMonthlyAllowanceAmount(personalLookup, filterOption)
  }

  calculateMonthlyDependantsAllowance (dependants: Dependant): number {
    if (!dependants) {
      return 0
    }

    let otherDependants = 0
    let dependantChildren = 0

    if (dependants.children) {
      const reducer = (total: number, children: Child) => {
        const numberOfDependants: number =
          children.ageGroupType !== AgeGroupType.BETWEEN_16_AND_19 ?
            children.numberOfChildren : children.numberOfChildrenLivingWithYou

        if (!numberOfDependants) {
          return total
        }
        return total + numberOfDependants
      }
      dependantChildren = dependants.children.reduce(reducer, 0)
    }

    if (dependants.otherDependants) {
      otherDependants = dependants.otherDependants.numberOfPeople
    }

    const totalNumberOfDependants: number = dependantChildren + otherDependants
    const allowancePerPerson = this.getMonthlyAllowanceAmount(this.allowancesLookup.dependant, 'EACH')

    return allowancePerPerson * totalNumberOfDependants
  }

  calculateMonthlyPensionerAllowance (income: Income[], partner: Partner): number {
    let pensionAllowance = 0
    if (!income) {
      return pensionAllowance
    }

    const defendantIsPensioner = income.filter(incomeType => incomeType.type === IncomeType.PENSION).pop() !== undefined
    if (defendantIsPensioner) {
      if (partner && partner.pensioner) {
        pensionAllowance = this.getMonthlyAllowanceAmount(this.allowancesLookup.pensioner, 'DEFENDANT_AND_PARTNER')
      } else {
        pensionAllowance = this.getMonthlyAllowanceAmount(this.allowancesLookup.pensioner, 'DEFENDANT_ONLY')
      }
    }
    return pensionAllowance
  }

  calculateMonthlyDisabilityAllowance (dependant: Dependant, carer: boolean, defendantDisability: DisabilityStatus, partner: Partner): number {

    const dependantAllowance = this.calculateMonthlyDisabilityDependantAllowance(dependant)
    const carerAllowance = this.calculateMonthlyCarerAllowance(carer)
    const dependantDisabilityOrCarerAmount = dependantAllowance > carerAllowance ? dependantAllowance : carerAllowance
    if (defendantDisability === DisabilityStatus.NO || defendantDisability === undefined) {
      return dependantDisabilityOrCarerAmount > 0 ? dependantDisabilityOrCarerAmount : 0
    }
    const disabilityLookup: AllowanceItem[] = this.allowancesLookup.disability
    let filterOption: string = defendantDisability === DisabilityStatus.YES ? 'DEFENDANT_ONLY' : 'DEFENDANT_ONLY_SEVERE'
    if (partner && partner.disability) {
      switch (partner.disability) {
        case DisabilityStatus.YES:
          filterOption = defendantDisability === DisabilityStatus.YES ? 'DEFENDANT_AND_PARTNER' : 'DEFENDANT_ONLY_SEVERE'
          break
        case DisabilityStatus.SEVERE:
          filterOption = defendantDisability === DisabilityStatus.YES ? 'DEFENDANT_ONLY_SEVERE' : 'DEFENDANT_AND_PARTNER_SEVERE'
          break
        default:
          break
      }
    }
    let disabilityAmount = this.getMonthlyAllowanceAmount(disabilityLookup,filterOption)

    return disabilityAmount > dependantDisabilityOrCarerAmount ? disabilityAmount : dependantDisabilityOrCarerAmount
  }

  calculateMonthlyDisabilityDependantAllowance (dependant: Dependant): number {
    if (dependant) {
      if (dependant.anyDisabledChildren) {
        return this.getMonthlyAllowanceAmount(this.allowancesLookup.disability,'DEPENDANT')
      }
      if (dependant.otherDependants) {
        if (dependant.otherDependants.anyDisabled) {
          return this.getMonthlyAllowanceAmount(this.allowancesLookup.disability,'DEPENDANT')
        }
      }
    }
    return 0
  }

  calculateMonthlyCarerAllowance (carer: boolean): number {
    if (!carer) {
      return 0
    }
    const disabilityLookup = this.allowancesLookup.disability
    const carerAmount = this.getMonthlyAllowanceAmount(disabilityLookup,'CARER')
    return carerAmount
  }

  private getMonthlyAllowanceAmount (searchArray: AllowanceItem[], filterOption: string): number {
    return searchArray.filter(category => category.item === filterOption).pop().monthly
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
