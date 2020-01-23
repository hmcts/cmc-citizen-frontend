import { expect } from 'chai'

import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { BankAccount, BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { PartyType } from 'common/partyType'
import {
  sampleElevenDependantDetails,
  sampleIncomesData,
  sampleIncomesWithPensionData,
  sampleOneDependantDetails,
  sampleOneDisabledDependantDetails,
  samplePartnerDetails,
  samplePartnerPensioner,
  samplePriorityDebts,
  samplePriorityDebtsNoAmount,
  samplePriorityDebtsNoFrequency,
  sampleStatementOfMeans,
  sampleStatementOfMeansAllAllowances, sampleStatementOfMeansWithAllDebtsExpensesAndAllowances,
  sampleStatementOfMeansWithMortgageAndRent,
  sampleStatementOfMeansWithPriorityDebts,
  sampleStatementOfMeansWithPriorityDebtsAndAllowances,
  sampleUnder18PartnerDetails
} from 'test/data/entity/statementOfMeansData'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import * as moment from 'moment'
import { AllowanceRepository, ResourceAllowanceRepository } from 'common/allowances/allowanceRepository'
import { AllowanceCalculations } from 'main/app/common/allowances/allowanceCalculations'
import { join } from 'path'
import { Allowance, Allowances } from 'common/allowances/allowance'
import { AllowanceItem } from 'common/allowances/allowanceItem'

let statementOfMeansCalculations: StatementOfMeansCalculations
let repository: AllowanceRepository
let allowanceCalculations: AllowanceCalculations

const sampleAllowanceDataLocation = join(__dirname,'..', '..', '..', 'data', 'entity','sampleAllowanceData.json')
const partyType: string = PartyType.INDIVIDUAL.value
const dateOfBirthOver18: moment.Moment = moment().subtract(24, 'year')

describe('StatementOfMeansCalculations', () => {

  //
  // DISPOSABLE INCOMES
  //

  describe('calculateTotalMonthlyDisposableIncome', () => {
    beforeEach(() => {
      repository = new ResourceAllowanceRepository(sampleAllowanceDataLocation)
      allowanceCalculations = new AllowanceCalculations(repository)
    })
    describe('when no allowance lookup is provided', () => {
      beforeEach(() => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(undefined)
      })
      describe('when defendant has no mortgage or rent expenses and allowances are undefined', () => {
        it('should calculate the total monthly disposable', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeans, partyType, dateOfBirthOver18))
            .to.equal(2195.416666666667)
        })
      })
      describe('when defendant has mortgage and rent, allowances are undefined', () => {
        it('should return disposable minus monthly mortgage and rent', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithMortgageAndRent, partyType, dateOfBirthOver18))
            .to.equal(1695.416666666667)
        })
      })
      describe('when defendant has priority debts, allowances are undefined', () => {
        it('should return disposable income minus priority debts', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithPriorityDebts, partyType, dateOfBirthOver18))
            .to.equal(1796.5333333333338)
        })
      })
    })

    describe('when allowance lookup is provided', () => {
      beforeEach(() => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(allowanceCalculations)
      })
      describe('when defendant has allowances', () => {
        it('should return disposable income minus allowances', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansAllAllowances, partyType, dateOfBirthOver18))
            .to.equal(2095.416666666667)
        })
      })
      describe('when defendant has mortgage and rent and defendant has allowances', () => {
        it('should return disposable income minus allowances and mortgage', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithMortgageAndRent, partyType, dateOfBirthOver18))
            .to.equal(1670.416666666667)
        })
      })
      describe('when defendant has priority debts and allowances', () => {
        it('should return disposable income minus allowances and priority debts', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithPriorityDebtsAndAllowances, partyType, dateOfBirthOver18))
            .to.equal(1696.5333333333338)
        })
      })
      describe('when defendant has mortgage, rent, priority debts and allowances', () => {
        it('should return disposable income minus allowances, mortgage, rent, debts, priority debts', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithAllDebtsExpensesAndAllowances, partyType, dateOfBirthOver18))
            .to.equal(1196.5333333333338)
        })
      })
    })
  })

  //
  // EXPENSES
  //
  beforeEach(() => {
    statementOfMeansCalculations = new StatementOfMeansCalculations()
  })

  describe('calculateTotalMonthlyExpense', () => {
    describe('when valid debts, courtOrders and expenses are provided', () => {
      it('should calculate the total monthly expense (mortgage and rent only)', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyExpense(sampleStatementOfMeansWithMortgageAndRent)).to.equal(640)
      })
    })

    describe('when no debts, courtOrders and expenses are provided', () => {
      it('should calculate a total monthly expense of zero', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyExpense({ bankAccounts: [] })).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyDebts', () => {
    describe('when valid monthly payments are provided', () => {
      it('should calculate the monthly debts', () => {
        const debts: Debt[] = sampleStatementOfMeans.debts
        expect(statementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(70)
      })
    })

    describe('when the monthly payment is unknown', () => {
      it('should ignore the debt during the calculation', () => {
        const debts: Debt[] = [
          {
            description: 'Something',
            totalOwed: 3000,
            monthlyPayments: undefined
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyCourtOrders', () => {
    describe('when valid monthly instalment amounts are provided', () => {
      it('should calculate the monthly court orders', () => {
        const courtOrders: CourtOrder[] = sampleStatementOfMeans.courtOrders
        expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(70)
      })
    })

    describe('when the monthly instalment amount is unknown', () => {
      it('should ignore the court order during the calculation', () => {
        const courtOrders: CourtOrder[] = [
          {
            claimNumber: '123',
            amountOwed: 2000,
            monthlyInstalmentAmount: undefined
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0)
      })
    })

    describe('when the monthly instalment amount is negative', () => {
      it('should ignore the court order during the calculation', () => {
        const courtOrders: CourtOrder[] = [
          {
            claimNumber: '123',
            amountOwed: 2000,
            monthlyInstalmentAmount: -20
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyRegularExpense', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total mortgage and rent', () => {
        const expenses: Expense[] = sampleStatementOfMeansWithMortgageAndRent.expenses
        expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(500)
      })
    })

    describe('when the frequency is unknown', () => {
      it('should ignore the regular expense during the calculation', () => {
        const expenses: Expense[] = [
          {
            type: ExpenseType.ELECTRICITY,
            frequency: undefined,
            amount: 100
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0)
      })
    })

    describe('when the amount is unknown', () => {
      it('should ignore the regular expense during the calculation', () => {
        const expenses: Expense[] = [
          {
            type: ExpenseType.ELECTRICITY,
            frequency: PaymentFrequency.MONTH,
            amount: undefined
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0)
      })
    })
  })

  describe('calculatePriorityDebts', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all priority debts', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(samplePriorityDebts.priorityDebts)).to.equal(398.8833333333333)
      })
    })
    describe('when the frequency is unknown', () => {
      it('should ignore the priority debts during the calculation', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(samplePriorityDebtsNoFrequency.priorityDebts)).to.equal(0)
      })
    })
    describe('when the amount is unknown', () => {
      it('should ignore the priority debts during the calculation', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(samplePriorityDebtsNoAmount.priorityDebts)).to.equal(0)
      })
    })
  })

  //
  // INCOMES
  //

  describe('calculateTotalMonthlyIncome', () => {
    describe('when valid bankAccounts, employment and incomes are provided', () => {
      it('should calculate the total monthly income', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyIncome(sampleStatementOfMeans)).to.equal(2335.416666666667)
      })
    })

    describe('when no employment and incomes are provided', () => {
      it('should calculate a total monthly income of zero', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyIncome({ bankAccounts: [] })).to.equal(0)
      })
    })
  })

  describe('calculateMonthlySelfEmployedTurnover', () => {
    describe('when self-employed', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = sampleStatementOfMeans.employment
        expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(250)
      })
    })

    describe('when self-employed but with no turnover', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = {}
        expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0)
      })
    })

    describe('when not self-employed', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = {}
        expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlySavings', () => {
    describe('when the bank account balance is unknown', () => {
      it('should ignore the bank account during the calculation', () => {
        const bankAccounts: BankAccount[] = [
          {
            type: BankAccountType.CURRENT_ACCOUNT,
            joint: false,
            balance: undefined
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0)
      })
    })

    describe('when the bank account balance is negative', () => {
      it('should ignore the bank account during the calculation', () => {
        const bankAccounts: BankAccount[] = [
          {
            type: BankAccountType.CURRENT_ACCOUNT,
            joint: false,
            balance: -1000
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0)
      })
    })

    describe('when there are no savings in excess', () => {
      it('should calculate a total savings amount of zero', () => {
        const bankAccounts: BankAccount[] = sampleStatementOfMeans.bankAccounts
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 4666.666666667)).to.equal(0)
      })
    })

    describe('when there are savings in excess', () => {
      it('should calculate the total savings amount', () => {
        const bankAccounts: BankAccount[] = sampleStatementOfMeans.bankAccounts
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 3000)).to.equal(208.33333333333334)
      })
    })
  })

  describe('calculateMonthlyRegularIncome', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all regular incomes', () => {
        const incomes: Income[] = sampleStatementOfMeans.incomes
        expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(1716.66666666666666)
      })
    })

    describe('when the frequency is unknown', () => {
      it('should ignore the regular income during the calculation', () => {
        const incomes: Income[] = [
          {
            type: IncomeType.JOB,
            frequency: undefined,
            amount: 100
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0)
      })
    })

    describe('when the amount is unknown', () => {
      it('should ignore the regular income during the calculation', () => {
        const incomes: Income[] = [
          {
            type: IncomeType.JOB,
            frequency: PaymentFrequency.MONTH,
            amount: undefined
          }
        ]
        expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0)
      })
    })
  })

  //
  // ALLOWANCES
  //

  describe('calculateTotalMonthlyAllowances', () => {
    beforeEach(() => {
      statementOfMeansCalculations = new StatementOfMeansCalculations(allowanceCalculations)
    })
    describe('when defendant is entitled to allowances', () => {
      it('should return a total for all the allowances when defendant under 25 ', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyAllowances(sampleStatementOfMeansAllAllowances, 18)).to.equal(275)
      })
      it('should return a total for all the allowances when defendant over 25', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyAllowances(sampleStatementOfMeansAllAllowances, 28)).to.equal(300)
      })
    })
  })

  describe('calculateMonthlyDisabilityAllowance', () => {
    beforeEach(() => {
      statementOfMeansCalculations = new StatementOfMeansCalculations(allowanceCalculations)
    })
    describe('when defendant is not disabled', () => {
      describe('when the defendant is not disabled', () => {
        it('should return 0 for disability allowance', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            false, DisabilityStatus.NO, undefined)).to.equal(0)
        })
      })
      describe('when partner is disabled', () => {
        it('should return 0 for disability allowance', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            false, DisabilityStatus.NO, samplePartnerDetails.partner)).to.equal(0)
        })
      })
      describe('when dependant is disabled', () => {
        it('should return amount for dependant care ', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(sampleOneDisabledDependantDetails.dependant,
            false, DisabilityStatus.NO, samplePartnerDetails.partner)).to.equal(180)
        })
      })
      describe('when defendant is a carer', () => {
        it('should return amount for carer', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            true, DisabilityStatus.NO, samplePartnerDetails.partner)).to.equal(90)
        })
      })
    })

    describe('when defendant is disabled', () => {
      describe('when the defendant is  disabled', () => {
        it('should return a disability allowance for the defendant', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            false, DisabilityStatus.YES, undefined)).to.equal(100)
        })
      })
      describe('when partner is severely disabled', () => {
        it('should return an allowance for partner disability', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            false, DisabilityStatus.YES, samplePartnerDetails.partner)).to.equal(200)
        })
      })
      describe('when defendant and partner are severely disabled', () => {
        it('should return an allowance for both defendant and partner', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            false, DisabilityStatus.SEVERE, samplePartnerDetails.partner)).to.equal(250)
        })
      })
      describe('when dependant is disabled', () => {
        it('should return the higher disability allowance for defendant', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            false, DisabilityStatus.SEVERE, undefined)).to.equal(200)
        })
      })
      describe('when defendant is a carer and is disabled and partner is severely', () => {
        it('should return the higher disability allowance for defendant', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            true, DisabilityStatus.YES, samplePartnerDetails.partner)).to.equal(200)
        })
      })
      describe('when defendant is a carer and is disabled', () => {
        it('should return the higher disability allowance for defendant', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined,
            true, DisabilityStatus.YES, undefined)).to.equal(100)
        })
      })
    })
  })

  describe('getMonthlyLivingAllowance', () => {
    describe('when date of birth is an invalid date', () => {
      it('should return 0 amount', () => {
        expect(allowanceCalculations.getMonthlyLivingAllowance(0, samplePartnerDetails.partner)).to.equal(0)
      })
    })
    describe('when date of birth is undefined', () => {
      it('should return 0 amount', () => {
        expect(allowanceCalculations.getMonthlyLivingAllowance(undefined,samplePartnerDetails.partner)).to.equal(0)
      })
    })
    describe('when date of birth makes the defendant less than 18', () => {
      it('should return 0 amount', () => {
        expect(allowanceCalculations.getMonthlyLivingAllowance(17,samplePartnerDetails.partner)).to.equal(0)
      })
    })
    describe('when the defendant is over 18 and partner is over 18', () => {
      it('should return 0 amount', () => {
        expect(allowanceCalculations.getMonthlyLivingAllowance(20,samplePartnerDetails.partner)).to.equal(200)
      })
    })
    describe('when date of birth makes the defendant over 25  and partner is over 18', () => {
      it('should return 0 amount', () => {
        expect(allowanceCalculations.getMonthlyLivingAllowance(25,sampleUnder18PartnerDetails.partner)).to.equal(150)
      })
    })
    describe('when date of birth makes the defendant over 18  and partner is over 18', () => {
      it('should return 0 amount', () => {
        expect(allowanceCalculations.getMonthlyLivingAllowance(19,sampleUnder18PartnerDetails.partner)).to.equal(100)
      })
    })
  })

  describe('getMonthlyDependantsAllowance', () => {
    describe('when number of dependants is one', () => {
      it('should return the allowance amount from one dependant', () => {
        expect(allowanceCalculations.getMonthlyDependantsAllowance(sampleOneDependantDetails.dependant)).to.equal(100)
      })
    })
    describe('when number of dependants is eleven', () => {
      it('should return the allowance amount from eleven dependants includes other dependants and children in education', () => {
        expect(allowanceCalculations.getMonthlyDependantsAllowance(sampleElevenDependantDetails.dependant)).to.equal(1100)
      })
    })
    describe('when number of dependants is undefined', () => {
      it('should return the zero', () => {
        expect(allowanceCalculations.getMonthlyDependantsAllowance(undefined)).to.equal(0)
      })
    })
  })

  describe('getMonthlyPensionerAllowance', () => {
    describe('when defendant is single and a pensioner', () => {
      it('should return single pensioner allowance', () => {
        expect(allowanceCalculations.getMonthlyPensionerAllowance(sampleIncomesWithPensionData.incomes, undefined)).to.equal(50)
      })
    })
    describe('when defendant and partner are pensioner', () => {
      it('should return single pensioner allowance and partner is a pensioner', () => {
        expect(allowanceCalculations.getMonthlyPensionerAllowance(sampleIncomesWithPensionData.incomes, samplePartnerPensioner.partner)).to.equal(100)
      })
    })
    describe('when defendant is not a pensioner and partner is pensioner', () => {
      it('should return single pensioner allowance and partner is a pensioner', () => {
        expect(allowanceCalculations.getMonthlyPensionerAllowance(sampleIncomesData.incomes, samplePartnerPensioner.partner)).to.equal(0)
      })
    })
    describe('when defendant is single and not a pensioner', () => {
      it('should return single pensioner allowance', () => {
        expect(allowanceCalculations.getMonthlyPensionerAllowance(sampleIncomesData.incomes, undefined)).to.equal(0)
      })
    })
  })

  describe('allowances', () => {
    describe('deserialize', () => {
      context('when there is a single allowance present', () => {
        it('should return valid data', () => {
          const input = {
            allowances :  [{
              personal : [ { item: 'item1', weekly: 10, monthly: 50 } ],
              dependant : [ { item: 'item2', weekly: 10, monthly: 50 } ],
              pensioner : [ { item: 'item3', weekly: 10, monthly: 50 } ],
              disability : [ { item: 'item4', weekly: 10, monthly: 50 } ],
              startDate : '2018-05-01T00:00:00.000Z'
            }]
          }
          const allowance: Allowance = new Allowances().deserialize(input)
          expect(allowance.personal[0].monthly).to.equal(50)
        })
      })
      context('when there is a single allowance present but start date in the future', () => {
        it('should return no data', () => {
          const input = {
            allowances :  [{
              personal : [ { item: 'item1', weekly: 10, monthly: 50 } ],
              dependant : [ { item: 'item2', weekly: 10, monthly: 50 } ],
              pensioner : [ { item: 'item3', weekly: 10, monthly: 50 } ],
              disability : [ { item: 'item4', weekly: 10, monthly: 50 } ],
              startDate : moment().add(1, 'day').toISOString()
            }]
          }
          const allowance: Allowance = new Allowances().deserialize(input)
          expect(allowance).to.equal(undefined)
        })
      })
      context('when there are multiple data present', () => {
        it('should return valid data that is not in the future', () => {
          const input = {
            allowances :  [
              {
                personal : [ { item: 'item1', weekly: 10, monthly: 50 } ],
                dependant : [ { item: 'item2', weekly: 10, monthly: 50 } ],
                pensioner : [ { item: 'item3', weekly: 10, monthly: 50 } ],
                disability : [ { item: 'item4', weekly: 10, monthly: 50 } ],
                startDate : '2018-05-01T00:00:00.000Z'
              },
              {
                personal : [ { item: 'item1', weekly: 10, monthly: 100 } ],
                dependant : [ { item: 'item2', weekly: 10, monthly: 100 } ],
                pensioner : [ { item: 'item3', weekly: 10, monthly: 100 } ],
                disability : [ { item: 'item4', weekly: 10, monthly: 100 } ],
                startDate : moment().add(1, 'day').toISOString()
              }
            ]
          }
          const allowance: Allowance = new Allowances().deserialize(input)
          expect(allowance.personal[0].monthly).to.equal(50)
        })
        it('should return valid data', () => {
          const input = {
            allowances :  [
              {
                personal : [ { item: 'item1', weekly: 10, monthly: 50 } ],
                dependant : [ { item: 'item2', weekly: 10, monthly: 50 } ],
                pensioner : [ { item: 'item3', weekly: 10, monthly: 50 } ],
                disability : [ { item: 'item4', weekly: 10, monthly: 50 } ],
                startDate : '2018-05-01T00:00:00.000Z'
              },
              {
                personal : [ { item: 'item1', weekly: 10, monthly: 100 } ],
                dependant : [ { item: 'item2', weekly: 10, monthly: 100 } ],
                pensioner : [ { item: 'item3', weekly: 10, monthly: 100 } ],
                disability : [ { item: 'item4', weekly: 10, monthly: 100 } ],
                startDate : moment().add(-1, 'day').toISOString()
              }
            ]
          }
          const allowance: Allowance = new Allowances().deserialize(input)
          expect(allowance.personal[0].monthly).to.equal(100)
        })
      })
    })
  })

  describe('allowance',() => {
    describe('deserialize',() => {
      describe('when a valid personal input is supplied ',() => {
        it('should return valid data', () => {
          const input = {
            personal : [ { item: 'SINGLE_18_TO_24', weekly: 10, monthly: 50 } ],
            startDate : moment()
          }
          const allowance: Allowance = new Allowance().deserialize(input)
          expect(allowance.personal[0].monthly).to.equal(50)
        })
      })
      describe('when a invalid personal input is supplied ',() => {
        it('should return undefined allowance', () => {
          const allowance: Allowance = new Allowance().deserialize(undefined)
          expect(allowance).to.equal(undefined)
        })
      })
    })
  })

  describe('allowanceItem',() => {
    describe('deserialize',() => {
      describe('when a valid personal input is supplied ',() => {
        it('should return valid data', () => {
          const input = { item: 'SINGLE_18_TO_24', weekly: 10, monthly: 50 }
          const allowanceItem: AllowanceItem = new AllowanceItem().deserialize(input)
          expect(allowanceItem.monthly).to.equal(50)
        })
      })
    })
  })
})
