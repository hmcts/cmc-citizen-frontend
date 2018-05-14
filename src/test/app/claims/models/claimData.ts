import { ClaimData } from 'claims/models/claimData'
import { expect } from 'chai'
import { Interest } from 'claims/models/interest'
import { InterestDate } from 'claims/models/interestDate'
import { interestData, interestDateData } from 'test/data/entity/claimData'

const INTEREST = new Interest().deserialize(interestData)
const INTEREST_DATE = new InterestDate().deserialize(interestDateData)

describe('ClaimData', () => {
  describe('interestDate getter', () => {
    const claimData = new ClaimData()

    it('should return the interestDate from the claimData object', () => {
      claimData.interest = INTEREST
      claimData.interestDate = INTEREST_DATE
      expect(claimData.interestDate).to.be.equal(INTEREST_DATE)
    })

    it('should return the interestDate from the interest object', () => {
      claimData.interest = { ...INTEREST, interestDate: INTEREST_DATE } as Interest
      claimData.interestDate = undefined
      expect(claimData.interestDate).to.be.equal(INTEREST_DATE)
    })

    it('should return the interestDate from the claimData object when both provided', () => {
      const OTHER_INTEREST_DATE = { ...INTEREST_DATE } as InterestDate
      claimData.interest = { ...INTEREST, interestDate: INTEREST_DATE } as Interest
      claimData.interestDate = OTHER_INTEREST_DATE
      expect(claimData.interestDate).to.be.equal(OTHER_INTEREST_DATE)
    })

    it('should return undefined if provided in neither', () => {
      claimData.interest = undefined
      claimData.interestDate = undefined
      expect(claimData.interestDate).to.be.equal(undefined)
    })
  })
})
