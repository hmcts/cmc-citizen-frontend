import { expect } from 'chai'
import { convertToRawObject } from 'test/rawObjectUtils'
import { RejectionClaimantResponse } from 'claims/models/claimant-response/rejectionClaimantResponse'

import {
  rejectionClaimantResponseData
} from 'test/data/entity/claimantResponseData'

describe('RejectionClaimantResponse', () => {

  describe('deserialize', () => {

    it('should return undefined when undefined input given', () => {
      const actual: RejectionClaimantResponse = RejectionClaimantResponse.deserialize(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it(`should deserialize valid JSON with no optionals to valid RejectionClaimantResponse object`, () => {
      const rejectionClaimantResponseDataWithNoOptionalsData = { ...rejectionClaimantResponseData }
      delete rejectionClaimantResponseDataWithNoOptionalsData.freeMediation
      delete rejectionClaimantResponseDataWithNoOptionalsData.reason
      const actual: RejectionClaimantResponse = RejectionClaimantResponse.deserialize(rejectionClaimantResponseDataWithNoOptionalsData)
      expect(convertToRawObject(actual)).to.be.deep.equal(rejectionClaimantResponseDataWithNoOptionalsData)
    })

    it(`should deserialize valid JSON to valid RejectionClaimantResponse object`, () => {

      const actual: RejectionClaimantResponse = RejectionClaimantResponse.deserialize(rejectionClaimantResponseData)
      expect(convertToRawObject(actual)).to.be.deep.equal(rejectionClaimantResponseData)
    })
  })
})
