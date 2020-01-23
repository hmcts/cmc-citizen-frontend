/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { LocalDate } from 'forms/models/localDate'

import { DecideHowYouWillPayTask } from 'response/tasks/decideHowYouWillPayTask'

import { FullAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { MomentFactory } from 'shared/momentFactory'
import { localDateFrom } from 'test/localDateUtils'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Defendant } from 'drafts/models/defendant'
import { ResponseType } from 'response/form/models/responseType'
import { Response } from 'response/form/models/response'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

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
  }
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())
  return responseDraft
}

describe('DecideHowYouWillPayTask', () => {

  context('should not be completed when', () => {

    it('payment object is undefined', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentIntention = new PaymentIntention()
      draft.fullAdmission.paymentIntention.paymentOption = undefined

      expect(DecideHowYouWillPayTask.isCompleted(draft)).to.be.false
    })

    it('payment option is undefined', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentIntention = new PaymentIntention()
      draft.fullAdmission.paymentIntention.paymentOption = new PaymentOption(undefined)

      expect(DecideHowYouWillPayTask.isCompleted(draft)).to.be.false
    })
  })

  context('when pay by set date is selected', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(PaymentType.BY_SET_DATE)
    })

    it('should not be completed when payment date wrapper is undefined', () => {
      responseDraft.fullAdmission.paymentIntention.paymentDate = undefined
      expect(DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should not be completed when payment date is undefined', () => {
      responseDraft.fullAdmission.paymentIntention.paymentDate.date = undefined
      expect(DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should not be completed when payment date is not valid', () => {
      responseDraft.fullAdmission.paymentIntention.paymentDate.date = new LocalDate()
      expect(DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should not be completed when payment date is not valid - date in the past', () => {
      responseDraft.fullAdmission.paymentIntention.paymentDate.date = localDateFrom(MomentFactory.currentDate().add(-10, 'day'))
      expect(DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false
    })

    it('should be completed when payment date is today', () => {
      expect(DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.true
    })
  })

  context('when pay by instalments is selected', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(PaymentType.INSTALMENTS)
    })

    it('should be completed', () => {
      expect(DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.true
    })
  })

  context('when pay immediately is selected', () => {
    let responseDraft: ResponseDraft

    beforeEach(() => {
      responseDraft = validResponseDraftWith(PaymentType.IMMEDIATELY)
    })

    it('should be completed', () => {
      expect(DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.true
    })
  })
})
