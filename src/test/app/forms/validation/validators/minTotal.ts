import { expect } from 'chai'

import { MinTotalConstraint } from 'app/forms/validation/validators/minTotal'
import { ClaimAmountRow } from 'app/forms/models/claimAmountRow'
import { ValidationArguments } from 'class-validator'

class TestValidationArguments implements ValidationArguments {
  value: any
  constraints: any[]
  targetName: string
  object: Object
  property: string

  constructor (minValue: number) {
    this.constraints = [minValue]
  }
}

describe('MinTotalConstraint', () => {
  const constraint = new MinTotalConstraint()
  let validationArguments: ValidationArguments

  beforeEach(() => {
    validationArguments = new TestValidationArguments(0.01)
  })

  describe('validate', () => {
    describe('should raise an error when', () => {
      it('not given the minimal amount constraint', () => {
        validationArguments.constraints = []
        expect(() => constraint.validate([], validationArguments)).to.throw(Error, 'Minimal required value parameter not given')
      })

      it('given non-numeric minimal amount', () => {
        validationArguments.constraints = ['not a number']
        expect(() => constraint.validate([], validationArguments)).to.throw(Error, 'Minimal required value parameter not given')
      })

      it('given empty empty object', () => {
        expect(() => constraint.validate({}, validationArguments)).to.throw(Error, 'Expected validated element to be an array')
      })
    })

    describe('given arbitrary minimal amount', () => {
      it('should return true when the value equal to the minimal', () => {
        validationArguments.constraints = [101]
        expect(constraint.validate([new ClaimAmountRow('', 101)], validationArguments)).to.equal(true)
      })

      it('should return true when the value more than the minimal', () => {
        validationArguments.constraints = [10]
        expect(constraint.validate([new ClaimAmountRow('', 20)], validationArguments)).to.equal(true)
      })

      it('should return false when the value more less the minimal', () => {
        validationArguments.constraints = [10]
        expect(constraint.validate([new ClaimAmountRow('', 9.99)], validationArguments)).to.equal(false)
      })
    })

    describe('given 0 minimal amount', () => {
      beforeEach(() => {
        validationArguments.constraints = [0]
      })

      it('should return true when empty array is given as input', () => {
        expect(constraint.validate([], validationArguments)).to.equal(true)
      })
    })

    describe('should return false when 0.01 is the minimum', () => {
      it('given empty array', () => {
        expect(constraint.validate([], validationArguments)).to.equal(false)
      })

      it('given row with undefined amount', () => {
        let value: ClaimAmountRow[] = [new ClaimAmountRow('', undefined)]
        expect(constraint.validate(value, validationArguments)).to.equal(false)
      })

      it('given row with negative amount', () => {
        let value: ClaimAmountRow[] = [new ClaimAmountRow('', -10)]
        expect(constraint.validate(value, validationArguments)).to.equal(false)
      })

      it('given row with smaller decimal amount', () => {
        let value: ClaimAmountRow[] = [new ClaimAmountRow('', 0.001)]
        expect(constraint.validate(value, validationArguments)).to.equal(false)
      })

      it('given row with empty object as amount', () => {
        let value: any[] = [{ amount: {} }]
        expect(constraint.validate(value, validationArguments)).to.equal(false)
      })

      it('given row with garbage string as amount', () => {
        let value: any[] = [{ amount: 'definitely not a number' }]
        expect(constraint.validate(value, validationArguments)).to.equal(false)
      })
    })

    describe('should return true when 0.01 is the minimum', () => {
      it('given null input', () => {
        expect(constraint.validate(null, validationArguments)).to.equal(true)
      })

      it('given undefined input', () => {
        expect(constraint.validate(undefined, validationArguments)).to.equal(true)
      })

      it('given a single row with required amount', () => {
        let value: ClaimAmountRow[] = [new ClaimAmountRow('', 0.01)]
        expect(constraint.validate(value, validationArguments)).to.equal(true)
      })

      it('given row with a greater amount', () => {
        let value: ClaimAmountRow[] = [new ClaimAmountRow('', 10)]
        expect(constraint.validate(value, validationArguments)).to.equal(true)
      })

      it('given a generic object with required amount as row', () => {
        let value: any[] = [{ amount: 0.01 }]
        expect(constraint.validate(value, validationArguments)).to.equal(true)
      })

      it('given a rows with single one with required amount', () => {
        let value: ClaimAmountRow[] = [
          new ClaimAmountRow('', 0),
          new ClaimAmountRow('', 0.01),
          new ClaimAmountRow('', 0.0)
        ]
        expect(constraint.validate(value, validationArguments)).to.equal(true)
      })

      it('given a rows with mixed invalid values and one required amount', () => {
        let value: ClaimAmountRow[] = [
          new ClaimAmountRow('', null),
          new ClaimAmountRow('', 0.01),
          new ClaimAmountRow('', undefined),
          new ClaimAmountRow('', 0)
        ]
        expect(constraint.validate(value, validationArguments)).to.equal(true)
      })
    })
  })
})
