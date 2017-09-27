import { expect } from 'chai'
import { IsLessThanOrEqualToSumOfConstraint } from 'forms/validation/validators/isLessThanOrEqualToSumOf'
import { ValidationArguments } from 'class-validator'

const DEFAULT_FIELD_TO_SUM_VALUE = 30
const DEFAULT_VALUE = 200

function validationArgs (fieldToSumValue: number, value: number): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { fieldToSum: fieldToSumValue, relatedField: value },
    property: undefined,
    constraints: ['fieldToSum', 'relatedField']
  }
}

describe('IsLessThanConstraint', () => {
  const constraint: IsLessThanOrEqualToSumOfConstraint = new IsLessThanOrEqualToSumOfConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given an undefined value', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('given a value less than relatedProperty', () => {
        expect(constraint.validate(10, validationArgs(DEFAULT_FIELD_TO_SUM_VALUE, DEFAULT_VALUE))).to.equal(true)
      })

      it('given an undefined sum property', () => {
        expect(constraint.validate(10, validationArgs(undefined, DEFAULT_VALUE))).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given an undefined related property', () => {
        expect(constraint.validate(10, validationArgs(100, undefined))).to.equal(false)
      })

      it('given an equal value', () => {
        expect(constraint.validate(DEFAULT_VALUE, validationArgs(DEFAULT_FIELD_TO_SUM_VALUE, DEFAULT_VALUE))).to.equal(false)
      })

      it('given a greater value', () => {
        expect(constraint.validate(DEFAULT_VALUE + 1, validationArgs(DEFAULT_FIELD_TO_SUM_VALUE, DEFAULT_VALUE))).to.equal(false)
      })
    })
  })
})
