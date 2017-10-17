import { expect } from 'chai'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { RejectPartOfClaim, RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'

describe('ResponseDraft', () => {
  describe('deserialization', () => {
    it('should return a ResponseDraft instance initialised with defaults for undefined', () => {
      expect(new ResponseDraft().deserialize(undefined)).to.eql(new ResponseDraft())
    })

    it('should return a ResponseDraft instance initialised with defaults for null', () => {
      expect(new ResponseDraft().deserialize(null)).to.eql(new ResponseDraft())
    })

    it('should return a ResponseDraft instance initialised with valid data', () => {
      const responseType: ResponseType = ResponseType.OWE_SOME_PAID_NONE

      const responseDraftModel: ResponseDraft = new ResponseDraft().deserialize(
        prepareInputData(responseType, MoreTimeNeededOption.YES)
      )

      expect(responseDraftModel.response.type).to.eql(responseType)
      expect(responseDraftModel.freeMediation.option).to.eql(FreeMediationOption.YES)
      expect(responseDraftModel.moreTimeNeeded.option).to.eql(MoreTimeNeededOption.YES)
      expect(responseDraftModel.isMoreTimeRequested()).to.be.eql(true)
    })
  })

  describe('isMoreTimeRequested', () => {
    it('should return false when more time was not requested', () => {
      const responseDraftModel: ResponseDraft = new ResponseDraft().deserialize(
        prepareInputData(ResponseType.OWE_ALL_PAID_NONE, MoreTimeNeededOption.NO)
      )

      expect(responseDraftModel.moreTimeNeeded.option).to.be.eq(MoreTimeNeededOption.NO)
      expect(responseDraftModel.isMoreTimeRequested()).to.be.eq(false)
    })

    it('should return false when instantiated with no input', () => {
      const responseDraftModel: ResponseDraft = new ResponseDraft()

      expect(responseDraftModel.moreTimeNeeded).to.be.eql(undefined)
      expect(responseDraftModel.isMoreTimeRequested()).to.be.eq(false)
    })
  })

  describe('requireDefence', () => {
    it('should return false when no response type set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.requireDefence()).to.be.eq(false)
    })

    it('should return false when response is full admission', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_ALL_PAID_NONE)

      expect(draft.requireDefence()).to.be.eq(false)
    })

    it('should return false when response is part admission', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)

      expect(draft.requireDefence()).to.be.eq(false)
    })

    it('should return false when response is full rejection without subtype selected', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_NONE)
      draft.rejectAllOfClaim = new RejectAllOfClaim(undefined)

      expect(draft.requireDefence()).to.be.eq(false)
    })

    it('should return false when response is full rejection with counter claim', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_NONE)
      draft.rejectAllOfClaim = new RejectAllOfClaim(RejectAllOfClaimOption.COUNTER_CLAIM)

      expect(draft.requireDefence()).to.be.eq(false)
    })

    it('should return true when response is full rejection without counter claim', () => {
      RejectAllOfClaimOption.except(RejectAllOfClaimOption.COUNTER_CLAIM).forEach(option => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.OWE_NONE)
        draft.rejectAllOfClaim = new RejectAllOfClaim(option)

        expect(draft.requireDefence()).to.be.eq(true)
      })
    })
  })

  describe('requireHowMuchPaid', () => {
    it('should return false when no response type set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.requireHowMuchPaid()).to.be.eq(false)
    })

    it('should return false when response is part admission', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)

      expect(draft.requireHowMuchPaid()).to.be.eq(false)
    })

    it('should return false when response is part admission without subtype selected', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)
      draft.rejectPartOfClaim = new RejectPartOfClaim(undefined)

      expect(draft.requireHowMuchPaid()).to.be.eq(false)
    })

    it('should return false when response is part admission with paid what believed was owed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)
      draft.rejectPartOfClaim = new RejectPartOfClaim(RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED)
      console.log(draft.rejectPartOfClaim)
      expect(draft.requireHowMuchPaid()).to.be.eq(false)
    })

    it('should return true when response is part admission with amount too high', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)
      draft.rejectPartOfClaim = new RejectPartOfClaim(RejectPartOfClaimOption.AMOUNT_TOO_HIGH)
      console.log(draft.rejectPartOfClaim)
      expect(draft.requireHowMuchPaid()).to.be.eq(true)
    })
  })

  describe('requireHowMuchOwed', () => {
    it('should return false when no response type set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.requireHowMuchOwed()).to.be.eq(false)
    })

    it('should return false when response is part admission', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)

      expect(draft.requireHowMuchOwed()).to.be.eq(false)
    })

    it('should return false when response is part admission without subtype selected', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)
      draft.rejectPartOfClaim = new RejectPartOfClaim(undefined)

      expect(draft.requireHowMuchOwed()).to.be.eq(false)
    })

    it('should return false when response is part admission with amount too high', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)
      draft.rejectPartOfClaim = new RejectPartOfClaim(RejectPartOfClaimOption.AMOUNT_TOO_HIGH)
      console.log(draft.rejectPartOfClaim)
      expect(draft.requireHowMuchOwed()).to.be.eq(false)
    })

    it('should return true when response is part admission with paid what believed was owed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.OWE_SOME_PAID_NONE)
      draft.rejectPartOfClaim = new RejectPartOfClaim(RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED)
      console.log(draft.rejectPartOfClaim)
      expect(draft.requireHowMuchOwed()).to.be.eq(true)
    })
  })

  function prepareInputData (responseType: ResponseType, moreTimeOption: string): object {
    return {
      response: {
        type: {
          value: responseType.value,
          displayValue: responseType.displayValue
        }
      },
      freeMediation: {
        option: FreeMediationOption.YES
      },
      moreTimeNeeded: {
        option: moreTimeOption
      }
    }
  }
})
