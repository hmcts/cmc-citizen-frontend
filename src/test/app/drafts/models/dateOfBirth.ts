import { expect } from 'chai'

import { DateOfBirth } from 'forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'

describe('Date of Birth', () => {
  describe('isCompleted', () => {
    it('should return true when there is a date', () => {
      const dob: DateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))
      expect(dob.isCompleted()).to.equal(true)
    })

    it('should return false when there is no date', () => {
      const dob: DateOfBirth = new DateOfBirth(true, new LocalDate())
      expect(dob.isCompleted()).to.equal(false)
    })
  })
})
