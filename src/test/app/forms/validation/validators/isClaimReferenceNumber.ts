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
      it('given an invalid reference 1234567', () => {
        expect(constraint.validate('1234567')).to.equal(false)
      })

      it('given an invalid reference RSAD', () => {
        expect(constraint.validate('RSAD')).to.equal(false)
      })

      it('given an invalid reference 12RS234', () => {
        expect(constraint.validate('12RS234')).to.equal(false)
      })
    })
  })
})
