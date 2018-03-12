import { expect } from 'chai'

import { InterestDate } from 'claim/form/models/interestDate'
import { InterestDateType } from 'app/common/interestDateType'

describe('Interest', () => {

  describe('isCompleted', () => {

    it('should return true when interest type is submission', () => {
      const interestDate: InterestDate = new InterestDate(InterestDateType.SUBMISSION)
      expect(interestDate.isCompleted()).to.equal(true)
    })

    it('should return true when interest type is custom', () => {
      const interestDate: InterestDate = new InterestDate(InterestDateType.CUSTOM)
      expect(interestDate.isCompleted()).to.equal(true)
    })

    it('should return false when there is no date', () => {
      const interestDate: InterestDate = new InterestDate()
      expect(interestDate.isCompleted()).to.equal(false)
    })
  })
})
