import { expect } from 'chai'
import { BreathingSpace } from 'claim/form/models/breathingSpace'

describe('BreathingSpace', () => {
  describe('deserialize', () => {
    it('should deserialize all the fields', () => {
      const breathingSpaceReferenceNumber = 'BS-0123456789'
      const breathingSpaceLiftedFlag = 'NO'
      const breathingSpaceType = 'STANDARD_BS_ENTERED'
      const breathingSpaceExternalId = 'bbb89313-7e4c-4124-8899-34389312033a'
      const actual = new BreathingSpace().deserialize(
        {
          bs_entered_date: '2021-03-18',
          bs_expected_end_date: '2021-06-18',
          bs_entered_date_by_insolvency_team: '2021-03-18',
          bs_lifted_date: '2021-03-18',
          bs_lifted_date_by_insolvency_team: '2021-03-18',
          bs_reference_number: breathingSpaceReferenceNumber,
          bs_lifted_flag: breathingSpaceLiftedFlag,
          bs_type: breathingSpaceType,
          externalId: breathingSpaceExternalId
        })
      expect(actual.breathingSpaceEnteredDate).to.not.eql(undefined)
      expect(actual.breathingSpaceEndDate).to.not.eql(undefined)
      expect(actual.breathingSpaceEnteredbyInsolvencyTeamDate).to.not.eql(undefined)
      expect(actual.breathingSpaceLiftedDate).to.not.eql(undefined)
      expect(actual.breathingSpaceLiftedbyInsolvencyTeamDate).to.not.eql(undefined)
      expect(actual.breathingSpaceReferenceNumber).to.equal(breathingSpaceReferenceNumber)
      expect(actual.breathingSpaceLiftedFlag).to.equal('NO')
      expect(actual.breathingSpaceType).to.equal(breathingSpaceType)
      expect(actual.breathingSpaceExternalId).to.equal(breathingSpaceExternalId)
    })
  })
})
