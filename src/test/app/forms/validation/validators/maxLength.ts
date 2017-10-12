import { expect } from 'chai'
import { ValidationArguments } from 'class-validator'
import { MaxLengthValidatorConstraint } from 'forms/validation/validators/maxLengthValidator'

const DEFAULT_VALUE = 9

function validationArgs (value: number): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { relatedField: value },
    property: undefined,
    constraints: [value]
  }
}

describe('MaxLengthValidatorConstraint', () => {
  const constraint: MaxLengthValidatorConstraint = new MaxLengthValidatorConstraint()

  describe('validate', () => {

    it('should throw exception when max length is < 0', () => {

      try {
        constraint.validate('my text', validationArgs(-1))
      } catch (e) {
        expect(e.message).to.be.eq('Max length must be > 0')
      }
    })

    context('should return true when ', () => {
      it('given an undefined value', () => {
        expect(constraint.validate(undefined, validationArgs(DEFAULT_VALUE))).to.be.equal(true)
      })

      it('given string is shorter than max length', () => {
        expect(constraint.validate('my text', validationArgs(DEFAULT_VALUE))).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given too long string', () => {
        expect(constraint.validate('01234567890123456789', validationArgs(DEFAULT_VALUE))).to.equal(false)
      })
    })
  })
})
