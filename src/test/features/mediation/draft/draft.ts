import { expect } from 'chai'

import { DraftMediation } from 'main/features/mediation/draft/draftMediation'

describe('DraftMediation', () => {
  describe('deserialization', () => {

    it('should return a DraftMediation instance initialised with defaults for undefined', () => {
      expect(new DraftMediation().deserialize(undefined)).to.eql(new DraftMediation())
    })

    it('should return a DraftMediation instance initialised with defaults for null', () => {
      expect(new DraftMediation().deserialize(null)).to.eql(new DraftMediation())
    })

    it('should return a DraftMediation instance initialised with valid data', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: DraftMediation = new DraftMediation().deserialize({
        externalId: myExternalId
      })
      expect(draft.externalId).to.eql(myExternalId)
    })
  })
})
