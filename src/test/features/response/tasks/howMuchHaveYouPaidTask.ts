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
import { LocalDate } from 'forms/models/localDate'
import { generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'

const validLocalDate = LocalDate.fromObject({ day: 1, month: 1, year: 2010 })
const validAmount = 100
const validText = 'valid'

function validResponseDraftPartAdmission (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.PART_ADMISSION)
  responseDraft.partialAdmission = new PartialAdmission()
  responseDraft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.YES)
  responseDraft.partialAdmission.howMuchHaveYouPaid = new HowMuchHaveYouPaid(validAmount, validLocalDate, validText)
  responseDraft.defendantDetails = new Defendant(new IndividualDetails())

  return responseDraft
}

function validResponseDraftFullRejectBecausePaidInFull (): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.DEFENCE)
  responseDraft.rejectAllOfClaim = new RejectAllOfClaim()
  responseDraft.rejectAllOfClaim.option = RejectAllOfClaimOption.ALREADY_PAID
  responseDraft.rejectAllOfClaim.howMuchHaveYouPaid = new HowMuchHaveYouPaid(validAmount, validLocalDate, validText)
  return responseDraft
}

describe('HowMuchHaveYouPaidTask', () => {
  describe('partial admission', () => {
    testAll(
      validResponseDraftPartAdmission,
      (draft, howMuchHaveYouPaid) => draft.partialAdmission.howMuchHaveYouPaid = howMuchHaveYouPaid
    )
  })

  describe('full decline because paid in full', () => {
    testAll(
      validResponseDraftFullRejectBecausePaidInFull,
      (draft, howMuchHaveYouPaid) => draft.rejectAllOfClaim.howMuchHaveYouPaid = howMuchHaveYouPaid
    )
  })
})

function testAll (
  draftSupplier: () => ResponseDraft,
  setter: (draft: ResponseDraft, howMuchHaveYouPaid: HowMuchHaveYouPaid) => void
) {
  context('should not be completed when', () => {

    it('howMuchHaveYouPaid is undefined', () => {
      const draft: ResponseDraft = draftSupplier()
      setter(draft, undefined)

      expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
    })

    context('amount is', () => {

      it('eq 0', () => {
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(0, validLocalDate, validText))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })

      it('less than 0', () => {
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(-10, validLocalDate, validText))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })
    })

    context('date is', () => {

      it('in the future', () => {
        const dateInThePast = LocalDate.fromObject({ day: 10, month: 10, year: 2200 })
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(validAmount, dateInThePast, validText))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })

      it('invalid', () => {
        const dateInThePast = LocalDate.fromObject({ day: 33, month: 13, year: 1990 })
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(validAmount, dateInThePast, validText))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })

      it('undefined', () => {
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(validAmount, undefined, validText))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })
    })

    context('text is', () => {

      it('empty', () => {
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(validAmount, validLocalDate, ''))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })

      it('undefined', () => {
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(validAmount, validLocalDate, undefined))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })

      it('too long', () => {
        const draft: ResponseDraft = draftSupplier()
        setter(draft, new HowMuchHaveYouPaid(
          validAmount, validLocalDate, generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
        ))

        expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.false
      })
    })

    it('should be completed when howMuchHaveYouPaid is valid', () => {
      const draft: ResponseDraft = draftSupplier()

      expect(HowMuchHaveYouPaidTask.isCompleted(draft)).to.be.true
    })
  })
}
