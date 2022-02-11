import { ClaimData } from 'claims/models/claimData'
import { expect } from 'chai'
import { Interest } from 'claims/models/interest'
import { InterestDate } from 'claims/models/interestDate'
import { breatingSpaceData, interestData, interestDateData } from 'test/data/entity/claimData'
import { BreathingSpace } from 'features/claim/form/models/breathingSpace'

const CLAIM_INTEREST = new Interest().deserialize(interestData)
const CLAIM_INTEREST_DATE = new InterestDate().deserialize(interestDateData)
const BREATHING_SPACE_DATA = new BreathingSpace().deserialize(breatingSpaceData)

describe('ClaimData', () => {
  describe('deserialize', () => {
    describe('interest', () => {

      it('should return the interestDate provided only under \'claimData\'', () => {
        const claimData = new ClaimData().deserialize({
          interest: interestData,
          interestDate: interestDateData
        })
        expect(claimData.interest).to.be.deep.equal({
          ...CLAIM_INTEREST,
          interestDate: CLAIM_INTEREST_DATE
        })
      })

      it('should return the interestDate provided only under \'claimData.interest\'', () => {
        const claimData = new ClaimData().deserialize({
          interest: {
            ...interestData,
            interestDate: interestDateData
          }
        })
        expect(claimData.interest).to.be.deep.equal({
          ...CLAIM_INTEREST,
          interestDate: CLAIM_INTEREST_DATE
        })
      })

      it('should return the interestDate provided under \'claimData\' if also provided under \'claimData.interest\'', () => {
        const claimData = new ClaimData().deserialize({
          interest: {
            ...interestData,
            interestDate: interestDateData
          },
          interestDate: interestDateData
        })
        expect(claimData.interest).to.be.deep.equal({
          ...CLAIM_INTEREST,
          interestDate: CLAIM_INTEREST_DATE
        })
      })

      it('should return no interestDate if not provided at all', () => {
        const claimData = new ClaimData().deserialize({
          interest: {
            ...interestData,
            interestDate: undefined
          },
          interestDate: undefined
        })

        expect(claimData.interest).to.be.deep.equal({
          ...CLAIM_INTEREST,
          interestDate: undefined
        })
      })

      it('should return helpWithFeesNumber and helpWithFeesType if provided', () => {
        const claimData = new ClaimData().deserialize({
          helpWithFeesNumber: '259023',
          helpWithFeesType: 'ClaimIssue'
        })

        expect(claimData.helpWithFeesNumber).to.equal('259023')
        expect(claimData.helpWithFeesType).to.equal('ClaimIssue')
      })

      it('should return helpWithFeesNumber and helpWithFeesType if provided', () => {
        const claimData = new ClaimData().deserialize({})

        // using to.equal to resolve typescript error
        expect(claimData.helpWithFeesNumber).to.equal(undefined)
        expect(claimData.helpWithFeesType).to.equal(undefined)
      })

      it('should return feeCode undefined as not available', () => {
        const claimData = new ClaimData().deserialize({})

        // using to.equal to resolve typescript error
        expect(claimData.feeCode).to.equal(undefined)
      })

      it('should return feeCode if provided', () => {
        const claimData = new ClaimData().deserialize({
          feeCode: 'FEE214'
        })

        // using to.equal to resolve typescript error
        expect(claimData.feeCode).to.equal('FEE214')
      })
    })
  })
})

describe('ClaimData', () => {
  describe('deserialize', () => {
    describe('breathingSpace', () => {

      it('should return breathingSpaceReferenceNumber, bsType and other values if provided', () => {
        const actual: BreathingSpace = new BreathingSpace().deserialize(BREATHING_SPACE_DATA)
        let expected: 'BS-1234567890'
        let expectdType: 'STANDARD_BS_ENTERED'

        expect(actual.breathingSpaceReferenceNumber).to.be.eq(expected)
        expect(actual.breathingSpaceType).to.be.eq(expectdType)
      })

      it('should return undefined if undefined is provided', () => {
        const actual: BreathingSpace = new BreathingSpace().deserialize(undefined)

        expect(actual).to.be.eq(undefined)
      })

    })
  })
})
