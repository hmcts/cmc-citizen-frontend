import { expect } from 'chai'
import { IsLessThanConstraint } from 'forms/validation/validators/isLessThan'
import { ValidationArguments } from 'class-validator'

const DEFAULT_VALUE = 200

function validationArgs (value: number): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { relatedField: value },
    property: undefined,
    constraints: ['relatedField']
  }
}

describe('IsLessThanConstraint', () => {
  const constraint: IsLessThanConstraint = new IsLessThanConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given an undefined value', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('given a value less than relatedProperty', () => {
        expect(constraint.validate(10, validationArgs(DEFAULT_VALUE))).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given an equal value', () => {
        expect(constraint.validate(DEFAULT_VALUE, validationArgs(DEFAULT_VALUE))).to.equal(false)
      })

      it('given a greater value', () => {
        expect(constraint.validate(DEFAULT_VALUE + 1, validationArgs(DEFAULT_VALUE))).to.equal(false)
      })
    })
  })
})
