/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Defendant } from 'drafts/models/defendant'

import { Response } from 'response/form/models/response'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'
import { ResponseType } from 'response/form/models/responseType'
import { HowMuchHaveYouPaidTask } from 'response/tasks/howMuchHaveYouPaidTask'

function validResponseDraft (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.PART_ADMISSION)
  responseDraft.partialAdmission = new PartialAdmission()
  responseDraft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.YES)
  responseDraft.partialAdmission.howMuchHaveYouPaid = new HowMuchHaveYouPaid(100)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())

  return responseDraft
}

describe('HowMuchHaveYouPaidTask', () => {

  context('should not be completed when', () => {

    it('response is not partially admission', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = {
        type: ResponseType.FULL_ADMISSION
      }

      expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
    })

    it('howMuchHaveYouPaid is undefined', () => {
      const draft: ResponseDraft = validResponseDraft()
      draft.partialAdmission.howMuchHaveYouPaid = undefined

      expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
    })

    it('howMuchHaveYouPaid.amount is 0', () => {
      const draft: ResponseDraft = validResponseDraft()
      draft.partialAdmission.howMuchHaveYouPaid = new HowMuchHaveYouPaid(0)

      expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
    })

    it('howMuchHaveYouPaid.amount is less than 0', () => {
      const draft: ResponseDraft = validResponseDraft()
      draft.partialAdmission.howMuchHaveYouPaid = new HowMuchHaveYouPaid(-10)

      expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when', () => {

    it('howMuchHaveYouPaid is valid', () => {
      const draft: ResponseDraft = validResponseDraft()

      expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.true
    })
  })
})
