import { expect } from 'chai'

import { InterestType } from 'claim/form/models/interest'
import { Interest } from 'claim/form/models/interest'

describe('Interest', () => {

  describe('isCompleted', () => {

    it('should return true when interest type is no interest', () => {
      const interest: Interest = new Interest(InterestType.NO_INTEREST)
      expect(interest.isCompleted()).to.equal(true)
    })

    it('should return true when interest type is standard', () => {
      const interest: Interest = new Interest(InterestType.STANDARD)
      expect(interest.isCompleted()).to.equal(true)
    })

    it('should return true when interest type is different', () => {
      const interest: Interest = new Interest(InterestType.DIFFERENT)
      expect(interest.isCompleted()).to.equal(true)
    })

    it('should return false when there is no date', () => {
      const interest: Interest = new Interest()
      expect(interest.isCompleted()).to.equal(false)
    })
  })
})
