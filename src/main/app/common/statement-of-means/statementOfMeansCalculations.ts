///<reference path="../../../../../node_modules/@types/node/index.d.ts"/>
import { Logger } from '@hmcts/nodejs-logging'

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
import { Arrear } from 'claims/models/response/statement-of-means/arrear'
import { Allowance, AllowanceItem } from 'claims/models/response/statement-of-means/allowance'
import { AgeGroupType as PartnerAgeGroupType, Partner } from 'claims/models/response/statement-of-means/partner'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { PartyType } from 'common/partyType'
import * as moment from 'moment'
import {Carer} from 'response/form/models/statement-of-means/carer'

const logger = Logger.getLogger('common/statement-of-means')
const allowancesLookup: Allowance = process.env.MEANS_ALLOWANCE_BLOB

export class StatementOfMeansCalculations {

  static calculateTotalMonthlyDisposableIncome (statementOfMeans: StatementOfMeans, defendantType: PartyType, defendantDateOfBirth: moment.Moment): number {
    const totalMonthlyIncome: number = StatementOfMeansCalculations.calculateTotalMonthlyIncome(statementOfMeans)
    const totalMonthlyExpense: number = StatementOfMeansCalculations.calculateTotalMonthlyExpense(statementOfMeans)
    const totalMonthlyAllowance: number = defendantType.value === PartyType.INDIVIDUAL.value ?
      StatementOfMeansCalculations.calculateMonthlyAllowances(statementOfMeans, defendantDateOfBirth) : 0

    const totalMonthlyDisposableIncome = (totalMonthlyIncome - totalMonthlyExpense) - totalMonthlyAllowance
    logger.debug('Monthly disposable income calculation: ', totalMonthlyDisposableIncome)
    return totalMonthlyDisposableIncome
  }

  static calculateTotalMonthlyExpense (statementOfMeans: StatementOfMeans): number {
    const monthlyDebts: number = statementOfMeans.debts ? StatementOfMeansCalculations.calculateMonthlyDebts(statementOfMeans.debts) : 0
    const monthlyDebtsInArrears: number = statementOfMeans.debts ? StatementOfMeansCalculations.calculateMonthlyDebtsInArrears(statementOfMeans.arrears) : 0
    const monthlyCourtOrders: number = statementOfMeans.courtOrders ? StatementOfMeansCalculations.calculateMonthlyCourtOrders(statementOfMeans.courtOrders) : 0
    const monthlyRegularExpense: number = statementOfMeans.expenses ? StatementOfMeansCalculations.calculateMonthlyRegularExpense(statementOfMeans.expenses) : 0

    const totalMonthlyExpense = monthlyDebts + monthlyDebtsInArrears + monthlyCourtOrders + monthlyRegularExpense
    logger.debug('Monthly expense calculation: ', totalMonthlyExpense)
    return totalMonthlyExpense
  }

  static calculateMonthlyAllowances (statementOfMeans: StatementOfMeans, defendantDateOfBirth: moment.Moment): number {

    const monthlyLivingAllowance: number = StatementOfMeansCalculations.calculateMonthlyLivingAllowance(defendantDateOfBirth, statementOfMeans.partner)
    const monthlyDependantsAllowance: number = StatementOfMeansCalculations.calculateMonthlyDependantsAllowance(statementOfMeans.dependant)
    const monthlyPensionerAllowance: number = StatementOfMeansCalculations.calculateMonthlyPensionerAllowance(statementOfMeans.incomes, statementOfMeans.partner)
    const monthlyDisabilityAllowance: number = StatementOfMeansCalculations.calculateMonthlyDisabilityAllowance(statementOfMeans.dependant, statementOfMeans.carer, statementOfMeans.disability, statementOfMeans.partner.disability)

    const totalMonthlyAllowance = monthlyLivingAllowance + monthlyDependantsAllowance + monthlyPensionerAllowance + monthlyDisabilityAllowance
    logger.debug('Monthly allowance calculation: ', totalMonthlyAllowance)
    return totalMonthlyAllowance
  }

  static calculateMonthlyLivingAllowance (defendantDateOfBirth: moment.Moment, partner: Partner): number {
    const defendantAge: number = moment().diff(moment(defendantDateOfBirth), 'years')
    if (defendantAge < 18) {
      return 0
    }
    let filterOption = ''
    const personalLookup = allowancesLookup.personal
    if (!partner) {
      filterOption = defendantAge < 25 ? 'SINGLE_18_TO_24' : 'SINGLE_OVER_25'
    } else {
      switch (partner.ageGroupType) {
        case PartnerAgeGroupType.UNDER_18:
          filterOption = defendantAge < 25 ? 'DEFENDANT_UNDER_25_PARTNER_UNDER_18' : 'DEFENDANT_OVER_25_PARTNER_UNDER_18'
          break
        case PartnerAgeGroupType.BETWEEN_18_AND_25:
        case PartnerAgeGroupType.OVER_25:
          filterOption = 'DEFENDANT_AND_PARTNER_OVER_18'
          break
      }
    }
    return this.getMonthlyAllowanceAmount(personalLookup, filterOption)
  }

  static calculateMonthlyDependantsAllowance (dependants: Dependant): number {

    if (!dependants.children && !dependants.otherDependants) {
      return 0
    }

    const reducer = (total: number, children: Child) => {
      const numberOfDependants: number =
        children.ageGroupType === AgeGroupType.BETWEEN_16_AND_19 ?
        children.numberOfChildren : children.numberOfChildrenLivingWithYou

      if (!numberOfDependants) {
        return total
      }
      return total + numberOfDependants
    }

    const dependantChildren = dependants.children.reduce(reducer, 0)
    const otherDependants: number = dependants.otherDependants ? dependants.otherDependants.numberOfPeople : 0
    const totalNumberOfDependants: number = dependantChildren + otherDependants
    const allowancePerPerson = this.getMonthlyAllowanceAmount(allowancesLookup.personal, 'EACH')

    return allowancePerPerson * totalNumberOfDependants
  }

  static calculateMonthlyPensionerAllowance (income: Income[], partner: Partner): number {
    let pensionAllowance = 0
    if (!income) {
      return pensionAllowance
    }
    const defendantIsPensioner = income.filter(incomeType => incomeType.type === IncomeType.PENSION).pop() === undefined ? false : true
    if (defendantIsPensioner) {
      if (partner.pensioner) {
        pensionAllowance = StatementOfMeansCalculations.getMonthlyAllowanceAmount(allowancesLookup.pensioner, 'DEFENDANT_AND_PARTNER')
      } else {
        pensionAllowance = StatementOfMeansCalculations.getMonthlyAllowanceAmount(allowancesLookup.pensioner, 'DEFENDANT_ONLY')
      }
    }
    return pensionAllowance
  }

  static calculateMonthlyDisabilityAllowance (dependant: Dependant, carer: Carer, defendantDisability: DisabilityStatus, partnerDisability: DisabilityStatus): number {
    if (defendantDisability === DisabilityStatus.NO || defendantDisability === undefined) {
      return 0
    }
    const disabilityLookup: AllowanceItem[] = allowancesLookup.disability
    let filterOption: string = defendantDisability === DisabilityStatus.YES ? 'DEFENDANT_ONLY' : 'DEFENDANT_ONLY_SEVERE'
    if (partnerDisability !== DisabilityStatus.NO || !partnerDisability) {
      switch (partnerDisability) {
        case DisabilityStatus.YES:
          filterOption = defendantDisability === DisabilityStatus.YES ? 'DEFENDANT_AND_PARTNER' : 'DEFENDANT_ONLY_SEVERE'
          break
        case DisabilityStatus.SEVERE:
          filterOption = defendantDisability === DisabilityStatus.YES ? 'DEFENDANT_ONLY_SEVERE' : 'DEFENDANT_AND_PARTNER_SEVERE'
          break
      }
    }
    let disabilityAmount = StatementOfMeansCalculations.getMonthlyAllowanceAmount(disabilityLookup,filterOption)
    let dependantDisabilityOrCarerAmount =
      StatementOfMeansCalculations.calculateMonthlyDisabilityDependantCarerAllowance(dependant, carer)

    return disabilityAmount > dependantDisabilityOrCarerAmount ? disabilityAmount : dependantDisabilityOrCarerAmount
  }

  static calculateMonthlyDisabilityDependantCarerAllowance (dependant: Dependant, carer: boolean): number {
    // check dependant/carer disability
    if (!dependant) {
      return 0
    }
    const disabilityLookup = allowancesLookup.disability
    const dependantAmount = dependant.anyDisabledChildren || dependant.otherDependants.anyDisabled ?
      StatementOfMeansCalculations.getMonthlyAllowanceAmount(disabilityLookup,'DEPENDANT') : 0
    const carerAmount = carer ? StatementOfMeansCalculations.getMonthlyAllowanceAmount(disabilityLookup,'CARER') : 0
    return dependantAmount > carerAmount ? dependantAmount : carerAmount
  }

  private static getMonthlyAllowanceAmount (searchArray: AllowanceItem[], filterOption: string): number {
    return searchArray.filter(category => category.item === filterOption).pop().monthly
  }

  static calculateMonthlyDebts (debts: Debt[]): number {

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

  static calculateMonthlyCourtOrders (courtOrders: CourtOrder[]): number {

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

  static calculateMonthlyDebtsInArrears (arrears: Arrear[]): number {
    const monthlyArrears: number = StatementOfMeansCalculations.calculateMonthlyRegularIncomeOrExpense(arrears)
    logger.debug('Monthly arrears calculation: ', monthlyArrears)
    return monthlyArrears
  }

  static calculateMonthlyRegularExpense (expenses: Expense[]): number {
    const monthlyRegularExpense = StatementOfMeansCalculations.calculateMonthlyRegularIncomeOrExpense(
      expenses.filter(value => {
        return value.type === ExpenseType.RENT || value.type === ExpenseType.MORTGAGE
      })
    )
    logger.debug('Monthly regular expense calculation: ', monthlyRegularExpense)
    return monthlyRegularExpense
  }

  static calculateTotalMonthlyIncome (statementOfMeans: StatementOfMeans): number {
    const monthlyRegularIncome = statementOfMeans.incomes ? StatementOfMeansCalculations.calculateMonthlyRegularIncome(statementOfMeans.incomes) : 0
    const monthlySelfEmployedTurnover = statementOfMeans.employment ? StatementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(statementOfMeans.employment) : 0
    const monthlySavings = StatementOfMeansCalculations.calculateMonthlySavings(statementOfMeans.bankAccounts, monthlyRegularIncome)

    const totalMonthlyIncome = monthlySelfEmployedTurnover + monthlySavings + monthlyRegularIncome
    logger.debug('Monthly income calculation: ', totalMonthlyIncome)
    return totalMonthlyIncome
  }

  static calculateMonthlySelfEmployedTurnover (employment: Employment): number {
    if (!employment.selfEmployment || !employment.selfEmployment.annualTurnover) {
      return 0
    }

    const monthlySelfEmployedTurnover = employment.selfEmployment.annualTurnover / 12
    logger.debug('Monthly self employed turnover: ', monthlySelfEmployedTurnover)
    return monthlySelfEmployedTurnover
  }

  static calculateMonthlySavings (bankAccounts: BankAccount[], monthlyRegularIncome: number): number {

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

  static calculateMonthlyRegularIncome (incomes: Income[]): number {
    const monthlyRegularIncome = StatementOfMeansCalculations.calculateMonthlyRegularIncomeOrExpense(incomes)
    logger.debug('Monthly regular income calculation: ', monthlyRegularIncome)
    return monthlyRegularIncome
  }

  private static calculateMonthlyRegularIncomeOrExpense (incomesOrExpenses: FrequencyBasedAmount[]): number {

    const reducer = (total: number, incomeOrExpense: FrequencyBasedAmount) => {
      const frequency: Frequency = StatementOfMeansCalculations.toFrequency(incomeOrExpense.frequency)
      const amount: number = incomeOrExpense.amount

      if (!frequency || !amount) {
        return total
      }

      return total + FrequencyConversions.convertAmountToMonthly(amount, frequency)
    }

    return incomesOrExpenses.reduce(reducer, 0)
  }

  private static toFrequency (paymentFrequency: PaymentFrequency): Frequency {
    try {
      return Frequency.of(paymentFrequency)
    } catch (error) {
      return undefined
    }
  }
}
