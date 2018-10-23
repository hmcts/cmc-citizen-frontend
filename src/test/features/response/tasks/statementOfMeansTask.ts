/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { BankAccountRow } from 'response/form/models/statement-of-means/bankAccountRow'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'
import { OnTaxPayments } from 'response/form/models/statement-of-means/onTaxPayments'

import { StatementOfMeansTask } from 'response/tasks/statementOfMeansTask'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { FullAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentPlan } from 'shared/components/payment-intention/model/paymentPlan'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { localDateFrom } from 'test/localDateUtils'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Defendant } from 'drafts/models/defendant'
import { ResponseType } from 'response/form/models/responseType'
import { Response } from 'response/form/models/response'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { BankAccounts } from 'response/form/models/statement-of-means/bankAccounts'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'
import { Education } from 'response/form/models/statement-of-means/education'
import { Unemployment } from 'response/form/models/statement-of-means/unemployment'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { EmployerRow } from 'response/form/models/statement-of-means/employerRow'
import { SelfEmployment } from 'response/form/models/statement-of-means/selfEmployment'
import { OtherDependants } from 'response/form/models/statement-of-means/otherDependants'
import { NumberOfPeople } from 'response/form/models/statement-of-means/numberOfPeople'
import { Debts } from 'response/form/models/statement-of-means/debts'
import { CourtOrders } from 'response/form/models/statement-of-means/courtOrders'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'
import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'
import { Explanation } from 'response/form/models/statement-of-means/explanation'
import { IncomeSource } from 'response/form/models/statement-of-means/incomeSource'
import { ExpenseSource } from 'response/form/models/statement-of-means/expenseSource'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { Disability, DisabilityOption } from 'response/form/models/statement-of-means/disability'
import { Cohabiting, CohabitingOption } from 'response/form/models/statement-of-means/cohabiting'

function validResponseDraftWith (paymentType: PaymentType): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.FULL_ADMISSION)
  responseDraft.fullAdmission = new FullAdmission()
  responseDraft.fullAdmission.paymentIntention = new PaymentIntention()
  responseDraft.fullAdmission.paymentIntention.paymentOption = new PaymentOption(paymentType)
  switch (paymentType) {
    case PaymentType.BY_SET_DATE:
      responseDraft.fullAdmission.paymentIntention.paymentDate = new PaymentDate(localDateFrom(MomentFactory.currentDate()))
      break
    case PaymentType.INSTALMENTS:
      responseDraft.fullAdmission.paymentIntention.paymentPlan = new PaymentPlan(
        1000,
        100,
        localDateFrom(MomentFactory.currentDate().add(1, 'day')),
        PaymentSchedule.EACH_WEEK
      )
      break
  }
  responseDraft.response = new Response(ResponseType.FULL_ADMISSION)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())
  responseDraft.statementOfMeans = new StatementOfMeans()
  // this is the simplest valid structure
  responseDraft.statementOfMeans.residence = new Residence(ResidenceType.OWN_HOME, 'description')
  responseDraft.statementOfMeans.disability = new Disability(DisabilityOption.NO)
  responseDraft.statementOfMeans.cohabiting = new Cohabiting(CohabitingOption.NO)
  responseDraft.statementOfMeans.dependants = new Dependants(false)
  responseDraft.statementOfMeans.otherDependants = new OtherDependants(false)
  responseDraft.statementOfMeans.employment = new Employment(false)
  responseDraft.statementOfMeans.unemployment = new Unemployment(UnemploymentType.RETIRED)
  responseDraft.statementOfMeans.bankAccounts = new BankAccounts([new BankAccountRow(BankAccountType.CURRENT_ACCOUNT, false, 100)])
  responseDraft.statementOfMeans.debts = new Debts(false)
  responseDraft.statementOfMeans.monthlyIncome = new MonthlyIncome(
    true, new IncomeSource(MonthlyIncomeType.JOB.displayValue, 100, IncomeExpenseSchedule.MONTH),
    undefined, new IncomeSource(MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.INCOME_SUPPORT.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.CHILD_BENEFIT.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, undefined, undefined),
    undefined, new IncomeSource(MonthlyIncomeType.PENSION.displayValue, undefined, undefined)
  )

  responseDraft.statementOfMeans.monthlyExpenses = new MonthlyExpenses(
    true, new ExpenseSource(MonthlyExpenseType.MORTGAGE.displayValue, 100, IncomeExpenseSchedule.MONTH),
    undefined, new ExpenseSource(MonthlyExpenseType.RENT.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.COUNCIL_TAX.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.GAS.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.ELECTRICITY.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.WATER.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.TRAVEL.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.SCHOOL_COSTS.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, undefined, undefined),
    undefined, new ExpenseSource(MonthlyExpenseType.TV_AND_BROADBAND.displayValue, undefined, undefined)
  )

  responseDraft.statementOfMeans.courtOrders = new CourtOrders(false)
  responseDraft.statementOfMeans.explanation = new Explanation('Some explanation')

  return responseDraft
}

describe('StatementOfMeansTask', () => {

  context('statement of means', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(PaymentType.BY_SET_DATE)
    })

    context('when it applies', () => {

      it('should not be completed when statement of means is undefined', () => {
        responseDraft.statementOfMeans = undefined
        expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
      })

      it('should not be completed when residence is undefined', () => {
        responseDraft.statementOfMeans.residence = undefined
        expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
      })

      it('should not be completed when residence is invalid', () => {
        responseDraft.statementOfMeans.residence.type = undefined
        expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
      })

      it('should be completed when all SOM items are valid', () => {
        expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
      })
    })

    context('isCompleted: ', () => {

      context('dependants group', () => {

        context('is completed when', () => {

          it('no children, no one supported', () => {
            responseDraft.statementOfMeans.dependants.declared = false
            responseDraft.statementOfMeans.otherDependants.declared = false

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

          it('no children, but supported', () => {
            responseDraft.statementOfMeans.dependants.declared = false
            responseDraft.statementOfMeans.otherDependants = new OtherDependants(true, new NumberOfPeople(3, 'story'))

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

          it('has young children', () => {
            responseDraft.statementOfMeans.dependants = new Dependants(true, new NumberOfChildren(2, 1, 0))

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

          it('has children between 16 and 19 and they do not educate', () => {
            const noOfChildrenBetween16and19: number = 2
            responseDraft.statementOfMeans.dependants = new Dependants(
              true, new NumberOfChildren(0, 0, noOfChildrenBetween16and19)
            )
            responseDraft.statementOfMeans.education = new Education(0, noOfChildrenBetween16and19)

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

          it('has children between 16 and 19 and they educate', () => {
            const noOfChildrenBetween16and19: number = 2
            responseDraft.statementOfMeans.dependants = new Dependants(
              true, new NumberOfChildren(0, 0, noOfChildrenBetween16and19)
            )
            responseDraft.statementOfMeans.education = new Education(1, noOfChildrenBetween16and19)

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

          it('has monthly income', () => {
            responseDraft.statementOfMeans.monthlyIncome = new MonthlyIncome(
              true, new IncomeSource(MonthlyIncomeType.JOB.displayValue, 100, IncomeExpenseSchedule.MONTH),
              undefined, new IncomeSource(MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.INCOME_SUPPORT.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.CHILD_BENEFIT.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, undefined, undefined),
              undefined, new IncomeSource(MonthlyIncomeType.PENSION.displayValue, undefined, undefined),
              undefined, []
            )

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

        })

        context('is not completed', () => {

          it('dependants section not submitted', () => {
            responseDraft.statementOfMeans.dependants = undefined

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
          })

          it('dependants submitted with children between 16 and 19 and education section not submitted', () => {
            responseDraft.statementOfMeans.dependants = new Dependants(true, new NumberOfChildren(0, 0, 1))
            responseDraft.statementOfMeans.education = undefined

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
          })

          it('other dependants not submitted', () => {
            responseDraft.statementOfMeans.otherDependants = undefined

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
          })
        })
      })

      context('employment group is completed when', () => {

        it('unemployed (default setup for mock)', () => {
          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

        it('employed with list of employers', () => {
          responseDraft.statementOfMeans.unemployment = undefined
          responseDraft.statementOfMeans.employment = new Employment(true, true, false)
          responseDraft.statementOfMeans.employers = new Employers([new EmployerRow('Company', 'job')])

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

        it('self-employed and not employed', () => {
          responseDraft.statementOfMeans.unemployment = undefined
          responseDraft.statementOfMeans.employment = new Employment(true, false, true)
          responseDraft.statementOfMeans.employers = undefined
          responseDraft.statementOfMeans.selfEmployment = new SelfEmployment('job', 1000)
          responseDraft.statementOfMeans.onTaxPayments = new OnTaxPayments(false)

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

        it('self-employed and employed', () => {
          responseDraft.statementOfMeans.unemployment = undefined
          responseDraft.statementOfMeans.employment = new Employment(true, true, true)
          responseDraft.statementOfMeans.employers = new Employers([new EmployerRow('Company', 'job')])
          responseDraft.statementOfMeans.selfEmployment = new SelfEmployment('job', 1000)
          responseDraft.statementOfMeans.onTaxPayments = new OnTaxPayments(false)

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

        it('self-employed with on tax payments', () => {
          responseDraft.statementOfMeans.unemployment = undefined
          responseDraft.statementOfMeans.employment = new Employment(true, false, true)
          responseDraft.statementOfMeans.selfEmployment = new SelfEmployment('job', 1000)
          responseDraft.statementOfMeans.onTaxPayments = new OnTaxPayments(true, 100, 'Taxes')

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

      })

      context('is not completed when', () => {

        it('employment not submitted', () => {
          responseDraft.statementOfMeans.employment = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('selected "no" for employment and not submitted unemployed', () => {
          responseDraft.statementOfMeans.employment = new Employment(false)
          responseDraft.statementOfMeans.unemployment = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('employed and not submitted employers', () => {
          responseDraft.statementOfMeans.employment = new Employment(true, true, false)
          responseDraft.statementOfMeans.employers = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('self-employed and not submitted selfEmployed', () => {
          responseDraft.statementOfMeans.employment = new Employment(true, false, true)
          responseDraft.statementOfMeans.selfEmployment = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('employed and self-employed and not submitted selfEmployed nor employers', () => {
          responseDraft.statementOfMeans.employment = new Employment(true, true, true)
          responseDraft.statementOfMeans.selfEmployment = undefined
          responseDraft.statementOfMeans.employers = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })
      })

      context('is not completed when', () => {

        it('residence not submitted', () => {
          responseDraft.statementOfMeans.residence = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('bankAccounts not submitted', () => {
          responseDraft.statementOfMeans.bankAccounts = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('debts not submitted', () => {
          responseDraft.statementOfMeans.debts = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('monthlyIncome not submitted', () => {
          responseDraft.statementOfMeans.monthlyIncome = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('monthlyExpenses not submitted', () => {
          responseDraft.statementOfMeans.monthlyExpenses = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('courtOrders not submitted', () => {
          responseDraft.statementOfMeans.courtOrders = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('explanation not submitted', () => {
          responseDraft.statementOfMeans.explanation = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })
      })
    })
  })
})
