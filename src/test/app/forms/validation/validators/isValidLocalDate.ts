import { expect } from 'chai'

import { IsValidLocalDateConstraint } from 'forms/validation/validators/isValidLocalDate'

import { LocalDate } from 'forms/models/localDate'

describe('IsValidLocalDateConstraint', () => {
  const constraint: IsValidLocalDateConstraint = new IsValidLocalDateConstraint()

  describe('validate', () => {
    it('should accept undefined value', () => {
      expect(constraint.validate(null)).to.be.equal(true)
    })

    it('should accept null value', () => {
      expect(constraint.validate(null)).to.be.equal(true)
    })

    it('should reject values other then LocalDate', () => {
      expect(constraint.validate({})).to.be.equal(false)
    })

    it('should reject incomplete dates', () => {
      expect(constraint.validate(new LocalDate(2017))).to.be.equal(false)
    })

    it('should reject non existing dates', () => {
      expect(constraint.validate(new LocalDate(2017, 2, 29))).to.be.equal(false)
    })
  })
})
