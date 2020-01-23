import { expect } from 'chai'

import { OweMoneyTask } from 'response/tasks/oweMoneyTask'

import { PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'

describe('OweMoneyTask', () => {

  describe('when no response', () => {

    it('should be not completed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(OweMoneyTask.isCompleted(draft)).to.equal(false)
    })
  })

  describe('when full admission', () => {

    it('should be completed when response is selected', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.FULL_ADMISSION)

      expect(OweMoneyTask.isCompleted(draft)).to.equal(true)
    })
  })

  describe('when part admission', () => {

    context('should be not completed when', () => {

      it('alreadyPaid is undefined', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.PART_ADMISSION)
        draft.partialAdmission = new PartialAdmission()
        draft.partialAdmission.alreadyPaid = undefined

        expect(OweMoneyTask.isCompleted(draft)).to.equal(false)
      })

      it('alreadyPaid is not populated', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.PART_ADMISSION)
        draft.partialAdmission = new PartialAdmission()
        draft.partialAdmission.alreadyPaid = new AlreadyPaid()

        expect(OweMoneyTask.isCompleted(draft)).to.equal(false)
      })

      it('alreadyPaid is invalid', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.PART_ADMISSION)
        draft.partialAdmission = new PartialAdmission()
        draft.partialAdmission.alreadyPaid = new AlreadyPaid().deserialize({ option: 'invalid!' })

        expect(OweMoneyTask.isCompleted(draft)).to.equal(false)
      })
    })

    it('should be completed when alreadyPaid is valid', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.PART_ADMISSION)
      draft.partialAdmission = new PartialAdmission()
      draft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.YES)

      expect(OweMoneyTask.isCompleted(draft)).to.equal(true)
    })
  })

  describe('when full rejection', () => {

    it('should be not completed when type of full admission is not selected', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.DEFENCE)
      draft.rejectAllOfClaim = new RejectAllOfClaim(undefined)

      expect(OweMoneyTask.isCompleted(draft)).to.equal(false)
    })

    it('should be completed when type of part admission is selected', () => {
      RejectAllOfClaimOption.all().forEach(option => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.DEFENCE)
        draft.rejectAllOfClaim = new RejectAllOfClaim(option)

        expect(OweMoneyTask.isCompleted(draft)).to.equal(true)
      })
    })
  })
})
