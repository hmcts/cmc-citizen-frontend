import { expect } from 'chai'
import { convertToRawObject } from 'test/rawObjectUtils'
import { ClaimantResponse } from 'claims/models/claimantResponse'

import {
  ccjAcceptationClaimantResponseData,
  rejectionClaimantResponseData
} from 'test/data/entity/claimantResponseData'

describe('ClaimantResponse', () => {

  describe('deserialize', () => {

    it('should return undefined when undefined input given', () => {
      const actual: ClaimantResponse = ClaimantResponse.deserialize(undefined)

      expect(actual).to.be.eq(undefined)
    })

    const tests = [
      { type: 'acceptation', data: ccjAcceptationClaimantResponseData },
      { type: 'rejection', data: rejectionClaimantResponseData }
    ]

    tests.forEach(test =>
      it(`should deserialize valid JSON of type '${test.type}' to valid ClaimantResponse object`, () => {
        const actual: ClaimantResponse = ClaimantResponse.deserialize(rejectionClaimantResponseData)
        expect(convertToRawObject(actual)).to.be.deep.equal(rejectionClaimantResponseData)
      })
    )
  })
})
