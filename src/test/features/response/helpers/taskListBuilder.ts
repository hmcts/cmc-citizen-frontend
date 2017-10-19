import { expect } from 'chai'
import { ResponseDraft } from 'response/draft/responseDraft'
import { RejectPartOfClaim, RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { ResponseType } from 'response/form/models/responseType'
import { Response } from 'response/form/models/response'

describe('TaskListBuilder', () => {

  context('How much have you paid the claimant?', () => {

    it('is completed when claim partly rejected and proper type selected', () => {
      const draft: ResponseDraft = buildDraftModel(RejectPartOfClaimOption.AMOUNT_TOO_HIGH)

      expect(draft.requireHowMuchPaid()).to.be.eq(true)
    })

    it('is not completed when model is not populated', () => {
      expect(new ResponseDraft().requireHowMuchPaid()).to.be.eq(false)
    })
  })

  context('How much money do you believe you owe?', () => {

    it('is completed when claim partly rejected and proper type selected', () => {
      const draft: ResponseDraft = buildDraftModel(RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED)

      expect(draft.requireHowMuchOwed()).to.be.eq(true)
    })

    it('is not completed when model is not populated', () => {
      expect(new ResponseDraft().requireHowMuchOwed()).to.be.eq(false)
    })
  })
})

function buildDraftModel (rejectPartOfClaimOption: string): ResponseDraft {
  const draft: ResponseDraft = new ResponseDraft()
  draft.response = new Response()
  draft.response.type = ResponseType.OWE_SOME_PAID_NONE
  draft.rejectPartOfClaim = new RejectPartOfClaim(rejectPartOfClaimOption)

  return draft
}
