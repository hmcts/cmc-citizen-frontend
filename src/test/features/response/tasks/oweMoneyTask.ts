import { expect } from 'chai'

import { OweMoneyTask } from 'response/tasks/oweMoneyTask'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { RejectPartOfClaim, RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'

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
    it('should be not completed when type of part admission is not selected', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.PART_ADMISSION)
      draft.rejectPartOfClaim = new RejectPartOfClaim(undefined)

      expect(OweMoneyTask.isCompleted(draft)).to.equal(false)
    })

    it('should be completed when type of part admission is selected', () => {
      RejectPartOfClaimOption.all().forEach(option => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.PART_ADMISSION)
        draft.rejectPartOfClaim = new RejectPartOfClaim(option)

        expect(OweMoneyTask.isCompleted(draft)).to.equal(true)
      })
    })
  })

  describe('when full admission', () => {
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
