/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { StatementOfMeansTask } from 'response/tasks/statementOfMeansTask'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { FullAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { DefendantPaymentPlan as PaymentPlan } from 'response/form/models/defendantPaymentPlan'
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
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { BankAccounts } from 'response/form/models/statement-of-means/bankAccounts'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'
import { Education } from 'response/form/models/statement-of-means/education'
import { Unemployed } from 'response/form/models/statement-of-means/unemployed'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { EmployerRow } from 'response/form/models/statement-of-means/employerRow'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { SupportedByYou } from 'response/form/models/statement-of-means/supportedByYou'
import { NumberOfPeople } from 'response/form/models/statement-of-means/numberOfPeople'
import { Debts } from 'response/form/models/statement-of-means/debts'
import { CourtOrders } from 'response/form/models/statement-of-means/courtOrders'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'

function validResponseDraftWith (paymentType: DefendantPaymentType): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.FULL_ADMISSION)
  responseDraft.fullAdmission = new FullAdmission()
  responseDraft.fullAdmission.paymentOption = new DefendantPaymentOption(paymentType)
  switch (paymentType) {
    case DefendantPaymentType.BY_SET_DATE:
      responseDraft.fullAdmission.paymentDate = new PaymentDate(localDateFrom(MomentFactory.currentDate()))
      break
    case DefendantPaymentType.INSTALMENTS:
      responseDraft.fullAdmission.paymentPlan = new PaymentPlan(
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
  responseDraft.statementOfMeans.residence = new Residence(ResidenceType.OWN_HOME)
  responseDraft.statementOfMeans.dependants = new Dependants(false)
  responseDraft.statementOfMeans.maintenance = new Maintenance(false)
  responseDraft.statementOfMeans.supportedByYou = new SupportedByYou(false)
  responseDraft.statementOfMeans.employment = new Employment(false)
  responseDraft.statementOfMeans.unemployed = new Unemployed(UnemploymentType.RETIRED)
  responseDraft.statementOfMeans.bankAccounts = new BankAccounts()
  responseDraft.statementOfMeans.debts = new Debts(false)
  responseDraft.statementOfMeans.monthlyIncome = new MonthlyIncome(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, [])
  responseDraft.statementOfMeans.monthlyExpenses = new MonthlyExpenses(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, [])
  responseDraft.statementOfMeans.courtOrders = new CourtOrders(false)

  return responseDraft
}

describe('StatementOfMeansTask', () => {

  context('statement of means', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(DefendantPaymentType.BY_SET_DATE)
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

    context('when it does not apply', () => {

      beforeEach(() => {
        responseDraft.response = new Response(ResponseType.DEFENCE)
      })

      it('should be complete when statement of means is undefined', () => {
        responseDraft.statementOfMeans = undefined
        expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
      })

      it('should be complete when statement of means item is invalid', () => {
        responseDraft.statementOfMeans.residence.type = undefined
        expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
      })
    })

    context('isCompleted: ', () => {

      context('dependants group', () => {

        context('is completed when', () => {

          it('no children, no maintenance, no one supported', () => {
            responseDraft.statementOfMeans.dependants.hasAnyChildren = false
            responseDraft.statementOfMeans.maintenance.option = false
            responseDraft.statementOfMeans.supportedByYou.doYouSupportAnyone = false

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

          it('no children, but maintenance', () => {
            responseDraft.statementOfMeans.dependants.hasAnyChildren = false
            responseDraft.statementOfMeans.maintenance = new Maintenance(true, 1)

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
          })

          it('no children and maintenance, but supported', () => {
            responseDraft.statementOfMeans.dependants.hasAnyChildren = false
            responseDraft.statementOfMeans.maintenance.option = false
            responseDraft.statementOfMeans.supportedByYou = new SupportedByYou(true, new NumberOfPeople(3, 'story'))

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

          it('maintenance not submitted', () => {
            responseDraft.statementOfMeans.maintenance = undefined

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
          })

          it('supported by you not submitted', () => {
            responseDraft.statementOfMeans.supportedByYou = undefined

            expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
          })
        })
      })

      context('employment group is completed when', () => {

        it('unemployed (default setup for mock)', () => {
          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

        it('employed with list of employers', () => {
          responseDraft.statementOfMeans.unemployed = undefined
          responseDraft.statementOfMeans.employment = new Employment(true, true, false)
          responseDraft.statementOfMeans.employers = new Employers([new EmployerRow('Company', 'job')])

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

        it('self-Employed and not employed', () => {
          responseDraft.statementOfMeans.unemployed = undefined
          responseDraft.statementOfMeans.employment = new Employment(true, false, true)
          responseDraft.statementOfMeans.employers = undefined
          responseDraft.statementOfMeans.selfEmployed = new SelfEmployed('job', 1000, false, 10, 'my story')

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.true
        })

        it('self-Employed and employed', () => {
          responseDraft.statementOfMeans.unemployed = undefined
          responseDraft.statementOfMeans.employment = new Employment(true, true, true)
          responseDraft.statementOfMeans.employers = new Employers([new EmployerRow('Company', 'job')])
          responseDraft.statementOfMeans.selfEmployed = new SelfEmployed('job', 1000, false)

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
          responseDraft.statementOfMeans.unemployed = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('employed and not submitted employers', () => {
          responseDraft.statementOfMeans.employment = new Employment(true, true, false)
          responseDraft.statementOfMeans.employers = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('self-employed and not submitted selfEmployed', () => {
          responseDraft.statementOfMeans.employment = new Employment(true, false, true)
          responseDraft.statementOfMeans.selfEmployed = undefined

          expect(StatementOfMeansTask.isCompleted(responseDraft)).to.be.false
        })

        it('employed and self-employed and not submitted selfEmployed nor employers', () => {
          responseDraft.statementOfMeans.employment = new Employment(true, true, true)
          responseDraft.statementOfMeans.selfEmployed = undefined
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
      })
    })
  })
})
