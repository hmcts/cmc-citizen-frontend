import { expect } from 'chai'
import { IsMobilePhoneConstraint } from 'forms/validation/validators/mobilePhone'

/**
 * The tests below are aligned to what GOV.UK Notify is accepting and not how we would like to validate phone numbers.
 */
describe('IsMobilePhoneConstraint', () => {
  const constraint: IsMobilePhoneConstraint = new IsMobilePhoneConstraint()

  describe('validate', () => {
    describe('for land line numbers', () => {
      it('should return false when given a valid land line number', () => {
        expect(constraint.validate('+44 (0203) 334 3555')).to.equal(false)
      })

      it('should return false when given an invalid land line number', () => {
        expect(constraint.validate('+44 (0203) 3555')).to.equal(false)
      })
    })

    describe('for mobile numbers starting with 0', () => {
      it('valid number should return true', () => {
        expect(constraint.validate('07873738547')).to.equal(true)
      })

      it('valid number with spaces should return true', () => {
        expect(constraint.validate('0 787 373 8547')).to.equal(true)
      })

      it('valid number with dashes should return true', () => {
        expect(constraint.validate('0-787-373-8547')).to.equal(true)
      })

      it('valid number with parentheses should return true', () => {
        expect(constraint.validate('(0) 7873738547')).to.equal(true)
      })

      it('valid number starting with # should return false', () => {
        expect(constraint.validate('#07873738547')).to.equal(false)
      })

      it('too short number should return false', () => {
        expect(constraint.validate('078737385')).to.equal(false)
      })

      it('too long number should return false', () => {
        expect(constraint.validate('078737385789')).to.equal(false)
      })
    })

    describe('for numbers with invalid characters', () => {
      it('should return false if the string is of length 10', () => {
        expect(constraint.validate('#$%^&$%^&*')).to.equal(false)
      })

      it('should return true if the string contains a valid number with valid characters in between', () => {
        expect(constraint.validate('0+7)8-7(3)7+3-8-5--4(7')).to.equal(true)
      })
    })

    describe('for numbers with international code', () => {
      it('valid number that starts with 00 44 code with spaces should return true', () => {
        expect(constraint.validate('00 44 7873738547')).to.equal(true)
      })

      it('valid number that starts with 0044 code should return true', () => {
        expect(constraint.validate('00447873738547')).to.equal(true)
      })

      it('valid number that starts with +44 code with spaces should return true', () => {
        expect(constraint.validate('+44 78 73 738547')).to.equal(true)
      })

      it('valid number that starts with +44 code should return true', () => {
        expect(constraint.validate('+447873738547')).to.equal(true)
      })

      it('valid number that is outside of uk (+48) should return false', () => {
        expect(constraint.validate('+487873738547')).to.equal(false)
      })

      it('valid number that is outside of uk (0048) should return false', () => {
        expect(constraint.validate('00487873738547')).to.equal(false)
      })

      it('invalid number that that starts with 0044 should return false', () => {
        expect(constraint.validate('0044123456')).to.equal(false)
      })

      it('invalid number that that starts with +44 should return false', () => {
        expect(constraint.validate('+441234567')).to.equal(false)
      })
    })
  })
})
