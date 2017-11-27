/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'

import { ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { PayBySetDate } from 'response/draft/payBySetDate'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'
import { MomentFactory } from 'common/momentFactory'
import { DefendantPaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { localDateFrom } from '../../../localDateUtils'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Defendant } from 'drafts/models/defendant'
import { ResponseType } from 'response/form/models/responseType'
import { Response } from 'response/form/models/response'

function validResponseDraftWith (paymentType: DefendantPaymentType): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  if (paymentType === DefendantPaymentType.BY_SET_DATE) {
    responseDraft.defendantPaymentOption = new DefendantPaymentOption(DefendantPaymentType.BY_SET_DATE)
    responseDraft.payBySetDate = new PayBySetDate(
      new PaymentDate(localDateFrom(MomentFactory.currentDate())),
      new Explanation('I an not able to pay now')
    )
  } else if (paymentType === DefendantPaymentType.INSTALMENTS) {
    responseDraft.defendantPaymentOption = new DefendantPaymentOption(DefendantPaymentType.INSTALMENTS)
    responseDraft.defendantPaymentPlan = new DefendantPaymentPlan(
      1000,
      100,
      100,
      localDateFrom(MomentFactory.currentDate().add(1, 'day')),
      PaymentSchedule.EACH_WEEK,
      'I am not able to pay immediately'
    )
  }
  responseDraft.response = new Response(ResponseType.OWE_ALL_PAID_NONE)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())
  responseDraft.statementOfMeans = new StatementOfMeans()
  responseDraft.statementOfMeans.residence = new Residence(ResidenceType.OWN_HOME)
  return responseDraft
}

function dateMoreThan28DaysFromNow () {
  return localDateFrom(MomentFactory.currentDate().add(1, 'months'))
}

describe('WhenWillYouPayTask', () => {
  it('should not be completed when object is undefined', () => {
    const draft: ResponseDraft = new ResponseDraft()
    draft.defendantPaymentOption = undefined

    expect(WhenWillYouPayTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when payment option is undefined', () => {
    const draft: ResponseDraft = new ResponseDraft()
    draft.defendantPaymentOption = new DefendantPaymentOption(undefined)

    expect(WhenWillYouPayTask.isCompleted(draft)).to.be.false
  })

  context('when pay by set date is selected', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(DefendantPaymentType.BY_SET_DATE)
    })

    it('should not be completed when pay by set is indefined', () => {
      responseDraft.payBySetDate = undefined
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should not be completed when payment date is not valid', () => {
      responseDraft.payBySetDate.paymentDate.date = undefined
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should not be completed when payment date is more than 28 days from today and explanation is not valid', () => {
      responseDraft.payBySetDate.paymentDate.date = dateMoreThan28DaysFromNow()
      responseDraft.payBySetDate.explanation.text = undefined
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should be completed when payment date is more than 28 days from today and explanation is valid', () => {
      responseDraft.payBySetDate.paymentDate.date = dateMoreThan28DaysFromNow()
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.true
    })

    it('should be completed when payment date is today', () => {
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.true
    })
  })

  context('when pay by instalments is selected', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(DefendantPaymentType.INSTALMENTS)
    })

    it('should not be completed when payment plan is undefined', () => {
      responseDraft.defendantPaymentPlan = undefined
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should not be completed when payment plan is not valid', () => {
      responseDraft.defendantPaymentPlan.firstPayment = undefined
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should be completed when payment plan is valid', () => {
      expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.true
    })
  })

  context('statement of means', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(DefendantPaymentType.BY_SET_DATE)
    })

    context('when it applies', () => {
      it('should not be completed when statement of means is undefined', () => {
        responseDraft.statementOfMeans = undefined
        expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
      })

      it('should not be completed when residence is undefined', () => {
        responseDraft.statementOfMeans.residence = undefined
        expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
      })

      it('should not be completed when residence is invalid', () => {
        responseDraft.statementOfMeans.residence.type = undefined
        expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.false
      })

      it('should be completed when all SOM items are valid', () => {
        expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.true
      })
    })

    context('when it does not apply', () => {
      beforeEach(() => {
        responseDraft.response = new Response(ResponseType.OWE_NONE)
      })

      it('should be complete when statement of means is undefined', () => {
        responseDraft.statementOfMeans = undefined
        expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.true
      })

      it('should be complete when statement of means item is invalid', () => {
        responseDraft.statementOfMeans.residence.type = undefined
        expect(WhenWillYouPayTask.isCompleted(responseDraft)).to.be.true
      })
    })
  })
})
