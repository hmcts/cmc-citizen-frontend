import { expect } from 'chai'
import { IsValidPostcodeConstraint } from 'forms/validation/validators/isValidPostcode'

describe('IsValidPostcodeConstraint', () => {
  const constraint: IsValidPostcodeConstraint = new IsValidPostcodeConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {

      it('given an undefined value', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('given an null value', () => {
        expect(constraint.validate(null)).to.equal(true)
      })

      it('given a valid postcode in lowercase', () => {
        expect(constraint.validate('sw1h9aj')).to.equal(true)
      })

      it('given a valid postcode in uppercase', () => {
        expect(constraint.validate('SW1H9AJ')).to.equal(true)
      })

      it('given a valid postcode in mixed case', () => {
        expect(constraint.validate('Sw1H9aJ')).to.equal(true)
      })

      it('given a valid postcode in uppercase with space', () => {
        expect(constraint.validate('SW1H 9AJ')).to.equal(true)
      })

      describe('should return true for valid formats ', () => {

        it('given a valid postcode of M1 1AA', () => {
          expect(constraint.validate('M1 1AA')).to.equal(true)
        })

        it('given a valid postcode of M60 1NW', () => {
          expect(constraint.validate('M60 1NW')).to.equal(true)
        })

        it('given a valid postcode of DN55 1PT', () => {
          expect(constraint.validate('DN55 1PT')).to.equal(true)
        })

        it('given a valid postcode of W1A 0AX', () => {
          expect(constraint.validate('W1A 0AX')).to.equal(true)
        })

        it('given a valid postcode of EC1A 1BB', () => {
          expect(constraint.validate('EC1A 1BB')).to.equal(true)
        })
      })

    })

    describe('should return false when ', () => {
      it('given an invalid postcode', () => {
        expect(constraint.validate('aaaaa')).to.equal(false)
      })

      it('given a number', () => {
        expect(constraint.validate(123)).to.equal(false)
      })

      it('given an object', () => {
        expect(constraint.validate({})).to.equal(false)
      })

      it('given an empty value', () => {
        expect(constraint.validate('')).to.equal(false)
      })
    })
  })
})
