import { expect } from 'chai'

import { InterestRate, InterestRateOption } from 'claim/form/models/interestRate'

describe('Interest', () => {

  describe('isCompleted', () => {

    it('should return true when interest type is no interest', () => {
      const interestRate: InterestRate = new InterestRate(InterestRateOption.NO_INTEREST)
      expect(interestRate.isCompleted()).to.equal(true)
    })

    it('should return true when interest type is standard', () => {
      const interestRate: InterestRate = new InterestRate(InterestRateOption.STANDARD)
      expect(interestRate.isCompleted()).to.equal(true)
    })

    it('should return true when interest type is different', () => {
      const interestRate: InterestRate = new InterestRate(InterestRateOption.DIFFERENT)
      expect(interestRate.isCompleted()).to.equal(true)
    })

    it('should return false when there is no date', () => {
      const interestRate: InterestRate = new InterestRate()
      expect(interestRate.isCompleted()).to.equal(false)
    })
  })
})
