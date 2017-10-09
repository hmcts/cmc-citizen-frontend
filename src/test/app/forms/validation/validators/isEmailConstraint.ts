import { expect } from 'chai'
import { IsEmailConstraint } from 'forms/validation/validators/isEmail'

describe('IsEmailConstraint', () => {
  const constraint: IsEmailConstraint = new IsEmailConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given a valid email', () => {
        expect(constraint.validate('my-test@example.com')).to.equal(true)
      })

      it('given an empty string', () => {
        expect(constraint.validate('')).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given an invalid email (string)', () => {
        expect(constraint.validate('aaaaa')).to.equal(false)
      })

      it('given a number', () => {
        expect(constraint.validate(123)).to.equal(false)
      })

      it('given an object', () => {
        expect(constraint.validate({})).to.equal(false)
      })

      it('given null', () => {
        expect(constraint.validate(null)).to.equal(false)
      })
    })
  })
})
