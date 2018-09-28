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
  sampleAllowanceData,
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
import { MomentFactory } from 'shared/momentFactory'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'

describe('StatementOfMeansCalculations', () => {

  //
  // DISPOSABLE INCOMES
  //
  let statementOfMeansCalculations: StatementOfMeansCalculations

  describe('calculateTotalMonthlyDisposableIncome', () => {

    describe('when no allowance lookup is provided', () => {
      beforeEach(() => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.parse('1999-01-01'), undefined)
      })
      describe('when defendant has no mortgage or rent expenses and allowances are undefined', () => {
        it('should calculate the total monthly disposable', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeans))
            .to.equal(2195.416666666667)
        })
      })
      describe('when defendant has mortgage and rent, allowances are undefined', () => {
        it('should return disposable minus monthly mortgage and rent', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithMortgageAndRent))
            .to.equal(1695.416666666667)
        })
      })
      describe('when defendant has priority debts, allowances are undefined', () => {
        it('should return disposable income minus priority debts', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithPriorityDebts))
            .to.equal(1796.5333333333338)
        })
      })
    })

    describe('when allowance lookup is provided', () => {
      beforeEach(() => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.parse('1999-01-01'), sampleAllowanceData)
      })
      describe('when defendant has allowances', () => {
        it('should return disposable income minus allowances', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansAllAllowances))
            .to.equal(2095.416666666667)
        })
      })
      describe('when defendant has mortgage and rent and defendant has allowances', () => {
        it('should return disposable income minus allowances and mortgage', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithMortgageAndRent))
            .to.equal(1670.416666666667)
        })
      })
      describe('when defendant has priority debts and allowances', () => {
        it('should return disposable income minus allowances and priority debts', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithPriorityDebtsAndAllowances))
            .to.equal(1696.5333333333338)
        })
      })
      describe('when defendant has mortgage, rent, priority debts and allowances', () => {
        it('should return disposable income minus allowances, mortgage, rent, debts, priority debts', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithAllDebtsExpensesAndAllowances))
            .to.equal(1196.5333333333338)
        })
      })
    })
  })

  //
  // EXPENSES
  //
  beforeEach(() => {
    statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.parse('1999-01-01'), sampleAllowanceData)
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
    describe('when defendant is entitled to allowances', () => {
      it('should return a total for all the allowances', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyAllowances(sampleStatementOfMeansAllAllowances)).to.equal(275)
      })
    })
  })

  describe('calculateMonthlyLivingAllowance', () => {

    describe('when date of birth is an invalid date', () => {
      it('should return 0 amount', () => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.currentDate(), sampleAllowanceData)
        expect(statementOfMeansCalculations.calculateMonthlyLivingAllowance(samplePartnerDetails.partner)).to.equal(0)
      })
    })
    describe('when date of birth is undefined', () => {
      it('should return 0 amount', () => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, undefined, sampleAllowanceData)
        expect(statementOfMeansCalculations.calculateMonthlyLivingAllowance(samplePartnerDetails.partner)).to.equal(0)
      })
    })
    describe('when date of birth makes the defendant less than 18', () => {
      it('should return 0 amount', () => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.parse('2002-03-01'), sampleAllowanceData)
        expect(statementOfMeansCalculations.calculateMonthlyLivingAllowance(samplePartnerDetails.partner)).to.equal(0)
      })
    })
    describe('when the defendant is over 18 and partner is over 18', () => {
      it('should return 0 amount', () => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.parse('1999-03-01'), sampleAllowanceData)
        expect(statementOfMeansCalculations.calculateMonthlyLivingAllowance(samplePartnerDetails.partner)).to.equal(200)
      })
    })
    describe('when date of birth makes the defendant over 25  and partner is over 18', () => {
      it('should return 0 amount', () => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.parse('1990-03-01'), sampleAllowanceData)
        expect(statementOfMeansCalculations.calculateMonthlyLivingAllowance(sampleUnder18PartnerDetails.partner)).to.equal(150)
      })
    })
    describe('when date of birth makes the defendant over 18  and partner is over 18', () => {
      it('should return 0 amount', () => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL.value, MomentFactory.parse('1999-03-01'), sampleAllowanceData)
        expect(statementOfMeansCalculations.calculateMonthlyLivingAllowance(sampleUnder18PartnerDetails.partner)).to.equal(100)
      })
    })
  })

  describe('calculateMonthlyDependantsAllowance', () => {

    describe('when number of dependants is one', () => {
      it('should return the allowance amount from one dependant', () => {
        expect(statementOfMeansCalculations.calculateMonthlyDependantsAllowance(sampleOneDependantDetails.dependant)).to.equal(100)
      })
    })
    describe('when number of dependants is eleven', () => {
      it('should return the allowance amount from eleven dependants includes other dependants and children in education', () => {
        expect(statementOfMeansCalculations.calculateMonthlyDependantsAllowance(sampleElevenDependantDetails.dependant)).to.equal(1100)
      })
    })
    describe('when number of dependants is undefined', () => {
      it('should return the zero', () => {
        expect(statementOfMeansCalculations.calculateMonthlyDependantsAllowance(undefined)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyPensionerAllowance', () => {

    describe('when defendant is single and a pensioner', () => {
      it('should return single pensioner allowance', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPensionerAllowance(sampleIncomesWithPensionData.incomes, undefined)).to.equal(50)
      })
    })
    describe('when defendant and partner are pensioner', () => {
      it('should return single pensioner allowance and partner is a pensioner', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPensionerAllowance(sampleIncomesWithPensionData.incomes, samplePartnerPensioner.partner)).to.equal(100)
      })
    })
    describe('when defendant is not a pensioner and partner is pensioner', () => {
      it('should return single pensioner allowance and partner is a pensioner', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPensionerAllowance(sampleIncomesData.incomes, samplePartnerPensioner.partner)).to.equal(0)
      })
    })
    describe('when defendant is single and not a pensioner', () => {
      it('should return single pensioner allowance', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPensionerAllowance(sampleIncomesData.incomes, undefined)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyDisabilityAllowance', () => {

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

    describe('calculateMonthlyCarerAllowance', () => {
      describe('when carer is undefined', () => {
        it('should return 0', () => {
          expect(statementOfMeansCalculations.calculateMonthlyCarerAllowance(undefined)).to.equal(0)
        })
      })
      describe('when the defendant is a carer', () => {
        it('should return carer allowance amount', () => {
          expect(statementOfMeansCalculations.calculateMonthlyCarerAllowance(true)).to.equal(90)
        })
      })
      describe('when the defendant is not a carer', () => {
        it('should return carer allowance amount', () => {
          expect(statementOfMeansCalculations.calculateMonthlyCarerAllowance(false)).to.equal(0)
        })
      })
    })

    describe('calculateMonthlyDisabilityDependantAllowance', () => {
      describe('when dependant is undefined', () => {
        it('should return 0', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityDependantAllowance(undefined)).to.equal(0)
        })
      })
      describe('when dependant is defined but not disabled', () => {
        it('should return 0', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityDependantAllowance(sampleOneDependantDetails.dependant)).to.equal(0)
        })
      })
      describe('when dependant is defined but not disabled', () => {
        it('should return disability allowance for a dependant for a month ', () => {
          expect(statementOfMeansCalculations.calculateMonthlyDisabilityDependantAllowance(sampleOneDisabledDependantDetails.dependant)).to.equal(180)
        })
      })
    })
  })
})
