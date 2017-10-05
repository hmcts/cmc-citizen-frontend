import { expect } from 'chai'

import { OfferDraft } from 'response/draft/offerDraft'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { SettleOutOfCourtOption } from 'response/form/models/settleOutOfCourt'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { CounterClaim } from 'response/form/models/counterClaim'
import { LocalDate } from 'forms/models/localDate'

describe('OfferDraft', () => {
  describe('deserialization', () => {
    it('should return a OfferDraft instance initialised with defaults for undefined', () => {
      expect(new OfferDraft().deserialize(undefined)).to.eql(new OfferDraft())
    })

    it('should return a OfferDraft instance initialised with defaults for null', () => {
      expect(new OfferDraft().deserialize(null)).to.eql(new OfferDraft())
    })

    it('should return a OfferDraft instance initialised with valid data', () => {
      const offerDraftModel: OfferDraft = new OfferDraft().deserialize(
        prepareInputData('OfferText', 'yes')
      )

      expect(offerDraftModel.offer.text).to.eql('OfferText')
      expect(offerDraftModel.settleOutOfCourt.option).to.eql(SettleOutOfCourtOption.YES)
    })
  })

  describe('isSettleOutOfCourt', () => {
    it('should return false when settleOutOfCourt is No', () => {
      const offerDraftModel: OfferDraft = new OfferDraft().deserialize(
        prepareInputData('', SettleOutOfCourtOption.NO)
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

  function prepareInputData (offerText: string, settleOutOfCourtOption: string): object {
    return {
      offer: {
        text: offerText,
        date: {day: 1, year: 1980, month: 1}
      },
      settleOutOfCourt: {
        option: settleOutOfCourtOption
      }
    }
  }
})
