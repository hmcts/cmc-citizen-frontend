import { expect } from 'chai'

import { CheckClaimReferenceNumberConstraint } from 'forms/validation/validators/isClaimReferenceNumber'

describe('CheckClaimReferenceNumberConstraint', () => {
  const constraint: CheckClaimReferenceNumberConstraint = new CheckClaimReferenceNumberConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given reference is undefined', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('given reference is empty space', () => {
        expect(constraint.validate('')).to.equal(true)
      })

      it('given reference is valid CMC claim reference', () => {
        expect(constraint.validate('000MC001')).to.equal(true)
      })

      it('given reference is valid CCBC reference', () => {
        expect(constraint.validate('A1QZ1234')).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given all numeric reference 1234567', () => {
        expect(constraint.validate('1234567')).to.equal(false)
      })

      it('given a shorter length reference RSAD', () => {
        expect(constraint.validate('RSAD')).to.equal(false)
      })

      it('given a longer length reference 123RD4567', () => {
        expect(constraint.validate('123RD4567')).to.equal(false)
      })

      it('given a reference having invalid format 12RS234', () => {
        expect(constraint.validate('12RS234')).to.equal(false)
      })
    })
  })
})
