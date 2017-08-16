import { expect } from 'chai'
import { FractionsConstraint } from 'app/forms/validation/validators/fractions'
import { ValidationArguments } from 'class-validator'

describe('FractionsConstraint', () => {
  const constraint: FractionsConstraint = new FractionsConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {

      it('given undefined value', () => {
        expect(constraint.validate(undefined, validationArgs(1, 2))).to.be.equal(true)
      })

      it('given null value', () => {
        expect(constraint.validate(null, validationArgs(1, 2))).to.be.equal(true)
      })

      it('given a valid decimal up to three decimal places ', () => {
        expect(constraint.validate(10.123, validationArgs(0, 3))).to.equal(true)
      })

      it('given a valid decimal with no decimal place ', () => {
        expect(constraint.validate(10, validationArgs(0, 2))).to.equal(true)
      })

    })

    describe('should return false when ', () => {
      it('given an more than allowed decimals', () => {
        expect(constraint.validate(10.12, validationArgs(1, 1))).to.equal(false)
      })

      it('given an less than allowed decimals', () => {
        expect(constraint.validate(10.1, validationArgs(2, 3))).to.equal(false)
      })
    })

    describe('should throw an error ', () => {
      it('if min constraint is not set', () => {
        expect(() => constraint.validate(10.12, validationArgs(undefined, 2))).to.throw(Error,
          'Minimum allowed decimal places has to be specified and positive value')
      })

      it('if max constraint is not set', () => {
        expect(() => constraint.validate(10.12, validationArgs(1, undefined))).to.throw(Error,
          'Maximum allowed decimal places has to be specified and positive value')
      })

      it('if min constraint is negative', () => {
        expect(() => constraint.validate(10.12, validationArgs(-1, 2))).to.throw(Error,
          'Minimum allowed decimal places has to be specified and positive value')
      })

      it('if max constraint is negative', () => {
        expect(() => constraint.validate(10.12, validationArgs(1, -1))).to.throw(Error,
          'Maximum allowed decimal places has to be specified and positive value')
      })
    })

  })
})

function validationArgs (min: number, max: number): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: undefined,
    property: undefined,
    constraints: [min, max]
  }
}
