/* tslint:disable:no-unused-expression */
import { PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { Defendant } from 'drafts/models/defendant'
import { IndividualDetails } from 'forms/models/individualDetails'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { expect } from 'chai'
import { WhyDoYouDisagree } from 'response/form/models/whyDoYouDisagree'
import { WhyDoYouDisagreeTask } from 'response/tasks/whyDoYouDisagreeTask'

const validText = 'valid'

function validResponseDraftPartAdmission (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.PART_ADMISSION)
  responseDraft.partialAdmission = new PartialAdmission()
  responseDraft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.YES)
  responseDraft.partialAdmission.whyDoYouDisagree = new WhyDoYouDisagree(validText)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())

  return responseDraft
}

function validResponseDraftFullRejectBecausePaidInFull (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.DEFENCE)
  responseDraft.rejectAllOfClaim = new RejectAllOfClaim()
  responseDraft.rejectAllOfClaim.option = RejectAllOfClaimOption.ALREADY_PAID
  responseDraft.rejectAllOfClaim.whyDoYouDisagree = new WhyDoYouDisagree(validText)
  return responseDraft
}

describe('WhyDoYouDisagreeTask', () => {
  describe('partial admission', () => {
    testAll(
      validResponseDraftPartAdmission,
      (draft, whyDoYouDisagree) => draft.partialAdmission.whyDoYouDisagree = whyDoYouDisagree
    )
  })

  describe('full decline because paid in full', () => {
    testAll(
      validResponseDraftFullRejectBecausePaidInFull,
      (draft, whyDoYouDisagree) => draft.rejectAllOfClaim.whyDoYouDisagree = whyDoYouDisagree
    )
  })
})

function testAll (
  draftSupplier: () => ResponseDraft,
  setter: (draft: ResponseDraft, whyDoYouDisagree: WhyDoYouDisagree) => void
) {
  context('should not be completed when', () => {
    it('whyDoYouDisagree is undefined', () => {
      const draft: ResponseDraft = draftSupplier()
      setter(draft, undefined)

      expect(WhyDoYouDisagreeTask.isCompleted(draft)).to.be.false
    })

    it('text is undefined', () => {
      const draft: ResponseDraft = draftSupplier()
      setter(draft, new WhyDoYouDisagree(undefined))

      expect(WhyDoYouDisagreeTask.isCompleted(draft)).to.be.false
    })

    it('text is empty', () => {
      const draft: ResponseDraft = draftSupplier()
      setter(draft, new WhyDoYouDisagree(''))

      expect(WhyDoYouDisagreeTask.isCompleted(draft)).to.be.false
    })
  })

  it('should be completed when whyDoYouDisagree is valid', () => {
    const draft: ResponseDraft = draftSupplier()
    setter(draft, new WhyDoYouDisagree(validText))

    expect(WhyDoYouDisagreeTask.isCompleted(draft)).to.be.true
  })
}
