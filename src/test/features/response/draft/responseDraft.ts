import { expect } from 'chai'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { CounterClaim } from 'response/form/models/counterClaim'

describe('ResponseDraft', () => {
  describe('deserialization', () => {
    it('should return a ResponseDraft instance initialised with defaults for undefined', () => {
      expect(new ResponseDraft().deserialize(undefined)).to.eql(new ResponseDraft())
    })

    it('should return a ResponseDraft instance initialised with defaults for null', () => {
      expect(new ResponseDraft().deserialize(null)).to.eql(new ResponseDraft())
    })

    it('should return a ResponseDraft instance initialised with valid data', () => {
      const responseType: ResponseType = ResponseType.OWE_ALL_PAID_ALL

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
        prepareInputData(ResponseType.OWE_ALL_PAID_ALL, MoreTimeNeededOption.NO)
      )

      expect(responseDraftModel.moreTimeNeeded.option).to.be.eq(MoreTimeNeededOption.NO)
      expect(responseDraftModel.isMoreTimeRequested()).to.be.eq(false)
    })

    it('should return false when instantiated with no input', () => {
      const responseDraftModel: ResponseDraft = new ResponseDraft()

      expect(responseDraftModel.moreTimeNeeded).to.be.eql(undefined)
      expect(responseDraftModel.isMoreTimeRequested()).to.be.eq(false)
    })
    describe('requireDefence', () => {
      it('should return false when no response type set', () => {
        const responseDraftModel: ResponseDraft = new ResponseDraft()

        expect(responseDraftModel.requireDefence()).to.be.eq(false)
      })
      it('should return false when response type is OWE_NONE and counter claim is true', () => {
        const responseDraftModel: ResponseDraft = new ResponseDraft()
        responseDraftModel.response = new Response(ResponseType.OWE_NONE)
        responseDraftModel.counterClaim = new CounterClaim(true)

        expect(responseDraftModel.requireDefence()).to.be.eq(false)

      })
      it('should return true when response type is OWE_NONE  and counter claim is false', () => {
        const responseDraftModel: ResponseDraft = new ResponseDraft()
        responseDraftModel.response = new Response(ResponseType.OWE_NONE)
        responseDraftModel.counterClaim = new CounterClaim(false)

        expect(responseDraftModel.requireDefence()).to.be.eq(true)

      })
      it('should return true when response type is OWE_ALL_PAID_ALL', () => {
        const responseDraftModel: ResponseDraft = new ResponseDraft()
        responseDraftModel.response = new Response(ResponseType.OWE_ALL_PAID_ALL)

        expect(responseDraftModel.requireDefence()).to.be.eq(true)
      })
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
