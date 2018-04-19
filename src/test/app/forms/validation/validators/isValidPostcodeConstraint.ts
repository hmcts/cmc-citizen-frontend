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

        it('given a valid postcode of format AN NAA', () => {
          expect(constraint.validate('M1 1AA')).to.equal(true)
        })

        it('given a valid postcode of format ANN NAA', () => {
          expect(constraint.validate('M60 1NW')).to.equal(true)
        })

        it('given a valid postcode of format AAN NAA', () => {
          expect(constraint.validate('CR2 6HX')).to.equal(true)
        })

        it('given a valid postcode of format AANN NAA', () => {
          expect(constraint.validate('DN55 1PT')).to.equal(true)
        })

        it('given a valid postcode of format ANA NAA', () => {
          expect(constraint.validate('W1A 0AX')).to.equal(true)
        })

        it('given a valid postcode of format AANA NAA', () => {
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
