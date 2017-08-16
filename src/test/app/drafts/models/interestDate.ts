import { expect } from 'chai'

import InterestDate from 'app/forms/models/interestDate'
import InterestDateType from 'app/common/interestDateType'

describe('Interest', () => {
  describe('isCompleted', () => {
    it('should return true when interest type is submission', () => {
      const interest: InterestDate = new InterestDate(InterestDateType.SUBMISSION)
      expect(interest.isCompleted()).to.equal(true)
    })

    it('should return true when interest type is custom', () => {
      const interest: InterestDate = new InterestDate(InterestDateType.CUSTOM)
      expect(interest.isCompleted()).to.equal(true)
    })

    it('should return false when there is no date', () => {
      const interest: InterestDate = new InterestDate()
      expect(interest.isCompleted()).to.equal(false)
    })
  })
})
