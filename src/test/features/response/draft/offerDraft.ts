import { expect } from 'chai'

import { OfferDraft } from 'response/draft/offerDraft'
import { SettleOutOfCourtOption } from 'response/form/models/settleOutOfCourt'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'

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
      const offerDraft: OfferDraft = new OfferDraft().deserialize(
        prepareInputData('', SettleOutOfCourtOption.NO)
      )

      expect(offerDraft.settleOutOfCourt.option).to.be.eq(MoreTimeNeededOption.NO)
      expect(offerDraft.isSettleOutOfCourt()).to.be.eq(false)
    })

    it('should return false when instantiated with no input', () => {
      const offerDraft: OfferDraft = new OfferDraft()

      expect(offerDraft.settleOutOfCourt).to.be.eql(undefined)
      expect(offerDraft.isSettleOutOfCourt()).to.be.eq(false)
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
