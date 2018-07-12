import { expect } from 'chai'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

describe('DraftClaimantResponse', () => {
  describe('deserialization', () => {

    it('should return a DraftClaimantResponse instance initialised with defaults for undefined', () => {
      expect(new DraftClaimantResponse().deserialize(undefined)).to.eql(new DraftClaimantResponse())
    })

    it('should return a DraftClaimantResponse instance initialised with defaults for null', () => {
      expect(new DraftClaimantResponse().deserialize(null)).to.eql(new DraftClaimantResponse())
    })

    it('should return a ResponseDraft instance initialised with valid data', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({ externalId: myExternalId })
      expect(draft.externalId).to.eql(myExternalId)
    })
  })
})
