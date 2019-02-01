import { expect } from 'chai'
import { convertToRawObject } from 'test/rawObjectUtils'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'

import {
  ccjAcceptationClaimantResponseData,
  settlementAcceptationClaimantResponseData,
  referToJudgeAcceptationClaimantResponseData
 } from 'test/data/entity/claimantResponseData'

describe('AcceptationClaimantResponse', () => {

  describe('deserialize', () => {

    it('should return undefined when undefined input given', () => {
      const actual: AcceptationClaimantResponse = AcceptationClaimantResponse.deserialize(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it(`should deserialize valid JSON with no optionals to valid AcceptationClaimantResponse object`, () => {
      const acceptationClaimantResponseWithNoOptionalsData = { ...ccjAcceptationClaimantResponseData }
      delete acceptationClaimantResponseWithNoOptionalsData.claimantPaymentIntention
      delete acceptationClaimantResponseWithNoOptionalsData.courtDetermination
      const actual: AcceptationClaimantResponse = AcceptationClaimantResponse.deserialize(acceptationClaimantResponseWithNoOptionalsData)
      expect(convertToRawObject(actual)).to.be.deep.equal(acceptationClaimantResponseWithNoOptionalsData)
    })

    const tests = [
      { type: 'CCJ', data: ccjAcceptationClaimantResponseData },
      { type: 'Settlement Agreement', data: settlementAcceptationClaimantResponseData },
      { type: 'Refer to Judge', data: referToJudgeAcceptationClaimantResponseData }
    ]

    tests.forEach(test =>
      it(`should deserialize valid JSON of type '${test.type}' to valid AcceptationClaimantResponse object`, () => {
        const actual: AcceptationClaimantResponse = AcceptationClaimantResponse.deserialize(test.data)
        expect(convertToRawObject(actual)).to.be.deep.equal(test.data)
      })
    )
  })
})
