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

function validResponseDraft (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.PART_ADMISSION)
  responseDraft.partialAdmission = new PartialAdmission()
  responseDraft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.NO)
  responseDraft.partialAdmission.paymentIntention = new PaymentIntention()
  responseDraft.partialAdmission.paymentIntention.paymentOption = new PaymentOption(PaymentType.IMMEDIATELY)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())

  return responseDraft
}

describe('WhenWillYouPayTask', () => {

  context('should not be completed when', () => {

    it('paymentOption is undefined', () => {
      const draft: ResponseDraft = validResponseDraft()
      draft.partialAdmission.paymentIntention.paymentOption = undefined

      expect(WhenWillYouPayTask.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when paymentOption is valid', () => {

    PaymentType.all().forEach(option => {
      it(`${option.value}`, () => {
        const draft: ResponseDraft = validResponseDraft()
        draft.partialAdmission.paymentIntention.paymentOption = new PaymentOption(option)

        expect(WhenWillYouPayTask.isCompleted(draft)).to.be.true
      })
    })
  })
})
