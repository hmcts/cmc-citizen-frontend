/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'

import { Response } from 'response/form/models/response'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { ResponseType } from 'response/form/models/responseType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Defendant } from 'drafts/models/defendant'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'

function validResponseDraft (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.PART_ADMISSION)
  responseDraft.partialAdmission = new PartialAdmission()
  responseDraft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.NO)
  responseDraft.partialAdmission.paymentOption = new DefendantPaymentOption(DefendantPaymentType.IMMEDIATELY)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())

  return responseDraft
}

describe('WhenWillYouPayTask', () => {

  context('should not be completed when', () => {

    it('response is not partial admission', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = {
        type: ResponseType.FULL_ADMISSION
      }

      expect(WhenWillYouPayTask.isCompleted(draft)).to.be.false
    })

    it('paymentOption is undefined', () => {
      const draft: ResponseDraft = validResponseDraft()
      draft.partialAdmission.paymentOption = undefined

      expect(WhenWillYouPayTask.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when paymentOption is valid', () => {

    DefendantPaymentType.all().forEach(option => {
      it(`${option.value}`, () => {
        const draft: ResponseDraft = validResponseDraft()
        draft.partialAdmission.paymentOption = new DefendantPaymentOption(option)

        expect(WhenWillYouPayTask.isCompleted(draft)).to.be.true
      })
    })
  })
})
