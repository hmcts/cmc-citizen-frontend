/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'

import { Response } from 'response/form/models/response'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { ResponseType } from 'response/form/models/responseType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Defendant } from 'drafts/models/defendant'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { localDateFrom } from 'test/localDateUtils'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'

function validResponseDraft (paymentType: PaymentType): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.PART_ADMISSION)
  responseDraft.partialAdmission = new PartialAdmission()
  responseDraft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.NO)
  responseDraft.partialAdmission.paymentIntention = new PaymentIntention()
  responseDraft.partialAdmission.paymentIntention.paymentOption = new PaymentOption(paymentType)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())

  return responseDraft
}

describe('WhenWillYouPayTask', () => {

  context('should not be completed when', () => {

    it('paymentOption is undefined', () => {
      const draft: ResponseDraft = validResponseDraft(PaymentType.IMMEDIATELY)
      draft.partialAdmission.paymentIntention.paymentOption = undefined

      expect(WhenWillYouPayTask.isCompleted(draft)).to.be.false
    })

    it('paymentOption is defined but payment date is in the past', () => {
      const draft: ResponseDraft = validResponseDraft(PaymentType.BY_SET_DATE)
      draft.partialAdmission.paymentIntention.paymentOption.option = PaymentType.BY_SET_DATE
      draft.partialAdmission.paymentIntention.paymentDate =
        new PaymentDate(localDateFrom(MomentFactory.currentDate().add(-10, 'day')))

      expect(WhenWillYouPayTask.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when response draft is valid', () => {

    PaymentType.all().forEach(option => {
      it(`${option.value}`, () => {
        const draft: ResponseDraft = validResponseDraft(option)
        draft.partialAdmission.paymentIntention.paymentOption = new PaymentOption(option)
        draft.partialAdmission.paymentIntention.paymentDate =
          new PaymentDate(localDateFrom(MomentFactory.currentDate()))

        expect(WhenWillYouPayTask.isCompleted(draft)).to.be.true
      })
    })
  })
})
