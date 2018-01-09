import { expect } from 'chai'
import { ValidationArguments } from 'class-validator'
import { MinConstraint } from 'forms/validation/validators/min'

function validationArgs (value: number): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { relatedField: value },
    property: undefined,
    constraints: [value]
  }
}

describe('MinConstraint', () => {
  const constraint: MinConstraint = new MinConstraint()

  describe('validate', () => {

    context('should return true when ', () => {

      it('given an undefined value', () => {
        expect(constraint.validate(undefined, validationArgs(0))).to.be.equal(true)
      })

      it('given value is greater than min value', () => {
        expect(constraint.validate(1, validationArgs(0))).to.equal(true)
      })

      it('given value is equal than min value', () => {
        expect(constraint.validate(1, validationArgs(1))).to.equal(true)
      })
    })

    context('should return false when ', () => {

      it('given value is lower than min value', () => {
        expect(constraint.validate(0, validationArgs(1))).to.equal(false)
      })
    })
  })
})
