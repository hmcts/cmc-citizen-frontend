import { expect } from 'chai'

import { MediationDraft } from 'main/features/mediation/draft/mediationDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'

describe('MediationDraft', () => {
  describe('deserialization', () => {

    it('should return a DraftMediation instance initialised with defaults for undefined', () => {
      expect(new MediationDraft().deserialize(undefined)).to.eql(new MediationDraft())
    })

    it('should return a DraftMediation instance initialised with defaults for null', () => {
      expect(new MediationDraft().deserialize(null)).to.eql(new MediationDraft())
    })

    it('should return a DraftMediation instance initialised with valid data', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: MediationDraft = new MediationDraft().deserialize({
        externalId: myExternalId,
        willYouTryMediation: {
          option: FreeMediationOption.YES
        }
      })
      expect(draft.externalId).to.eql(myExternalId)
      expect(draft.willYouTryMediation.option).to.eql(FreeMediationOption.YES)
    })
  })
})
