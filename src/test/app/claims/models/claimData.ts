import { ClaimData } from 'claims/models/claimData'
import { expect } from 'chai'
import { Interest } from 'claims/models/interest'
import { InterestDate } from 'claims/models/interestDate'
import { interestData, interestDateData } from 'test/data/entity/claimData'

const CLAIM_INTEREST = new Interest().deserialize(interestData)
const CLAIM_INTEREST_DATE = new InterestDate().deserialize(interestDateData)

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
          helpWithFeesType: 'Claim Issue'
        })

        expect(claimData.helpWithFeesNumber).to.equal('259023')
        expect(claimData.helpWithFeesType).to.equal('Claim Issue')
      })
      it('should return helpWithFeesNumber and helpWithFeesType if provided', () => {
        const claimData = new ClaimData().deserialize({})

        // using to.equal to resolve typescript error
        expect(claimData.helpWithFeesNumber).to.equal(undefined)
        expect(claimData.helpWithFeesType).to.equal(undefined)
      })
    })
  })
})
