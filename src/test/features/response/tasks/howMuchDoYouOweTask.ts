/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'

import { Response } from 'response/form/models/response'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { ResponseType } from 'response/form/models/responseType'
import { HowMuchDoYouOweTask } from 'response/tasks/howMuchDoYouOweTask'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Defendant } from 'drafts/models/defendant'

const amountOwed = 100
const totalAmount = 500

function validResponseDraft (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.PART_ADMISSION)
  responseDraft.partialAdmission = new PartialAdmission()
  responseDraft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.NO)
  responseDraft.partialAdmission.howMuchDoYouOwe = new HowMuchDoYouOwe(amountOwed, totalAmount)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())

  return responseDraft
}

describe('HowMuchDoYouOweTask', () => {

  context('should not be completed when', () => {

    it('howMuchDoYouOwe is undefined', () => {
      const draft: ResponseDraft = validResponseDraft()
      draft.partialAdmission.howMuchDoYouOwe = undefined

      expect(HowMuchDoYouOweTask.isCompleted(draft)).to.be.false
    })

    context('amount is', () => {

      it('eq 0', () => {
        const draft: ResponseDraft = validResponseDraft()
        draft.partialAdmission.howMuchDoYouOwe = new HowMuchDoYouOwe(0)

        expect(HowMuchDoYouOweTask.isCompleted(draft)).to.be.false
      })

      it('less than 0', () => {
        const draft: ResponseDraft = validResponseDraft()
        draft.partialAdmission.howMuchDoYouOwe = new HowMuchDoYouOwe(-10)

        expect(HowMuchDoYouOweTask.isCompleted(draft)).to.be.false
      })

      it('greater than claimed amount', () => {
        const draft: ResponseDraft = validResponseDraft()
        draft.partialAdmission.howMuchDoYouOwe = new HowMuchDoYouOwe(totalAmount + 1, totalAmount)

        expect(HowMuchDoYouOweTask.isCompleted(draft)).to.be.false
      })
    })
  })

  it('should be completed when howMuchDoYouOwe is valid', () => {
    const draft: ResponseDraft = validResponseDraft()

    expect(HowMuchDoYouOweTask.isCompleted(draft)).to.be.true
  })
})
