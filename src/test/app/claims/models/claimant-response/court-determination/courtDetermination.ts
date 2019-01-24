import { expect } from 'chai'
import { convertToRawObject } from 'test/rawObjectUtils'
import { CourtDetermination } from 'claims/models/claimant-response/court-determination/courtDetermination'
import { DecisionType } from 'common/court-calculations/decisionType'

import { courtDeterminationData } from 'test/data/entity/courtDeterminationData'

describe('CourtDetermination', () => {

  describe('deserialize', () => {

    it('should return undefined when undefined input given', () => {
      const actual: CourtDetermination = CourtDetermination.deserialize(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it(`should deserialize valid JSON with no optionals to valid CourtDetermination object`, () => {
      const courtDeterminationWithNoOptionalsData = { ...courtDeterminationData }
      delete courtDeterminationWithNoOptionalsData.rejectionReason
      const actual: CourtDetermination = CourtDetermination.deserialize(courtDeterminationWithNoOptionalsData)
      expect(convertToRawObject(actual)).to.be.deep.equal(courtDeterminationWithNoOptionalsData)
    })

    const tests = [
      {
        type: DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT,
        data: { ...courtDeterminationData, decisionType: DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT }
      },
      {
        type: DecisionType.CLAIMANT,
        data: { ...courtDeterminationData, decisionType: DecisionType.CLAIMANT }
      },
      {
        type: DecisionType.DEFENDANT,
        data: { ...courtDeterminationData, decisionType: DecisionType.DEFENDANT }
      },
      {
        type: DecisionType.COURT,
        data: { ...courtDeterminationData, decisionType: DecisionType.COURT }
      }
    ]

    tests.forEach(test =>
      it(`should deserialize valid JSON of type '${test.type}' to valid CourtDetermination object`, () => {
        const actual: CourtDetermination = CourtDetermination.deserialize(test.data)
        expect(convertToRawObject(actual)).to.be.deep.equal(test.data)
      })
    )
  })
})
