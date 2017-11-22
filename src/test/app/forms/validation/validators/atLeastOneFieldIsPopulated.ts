import { expect } from 'chai'

import { AtLeastOneFieldIsPopulatedConstraint } from 'forms/validation/validators/atLeastOneFieldIsPopulated'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'

describe('AtLeastOneFieldIsPopulatedConstraint', () => {
  const constraint: AtLeastOneFieldIsPopulatedConstraint = new AtLeastOneFieldIsPopulatedConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {

      it('undefined given', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('all fields are populated (INVALID values)', () => {
        expect(constraint.validate(new NumberOfChildren(-1, ' ' as any, 1.1))).to.be.eq(true)
      })

      it('all fields are populated', () => {
        expect(constraint.validate(new NumberOfChildren(1, 1, 1))).to.be.eq(true)
      })
    })

    describe('should return false when ', () => {

      it('given empty strings', () => {
        expect(constraint.validate(new NumberOfChildren('' as any, '' as any, '' as any))).to.equal(false)
      })

      it('undefined values given', () => {
        expect(constraint.validate(new NumberOfChildren(undefined, undefined, undefined))).to.equal(false)
      })

      it('all field populated with zeros', () => {
        expect(constraint.validate(new NumberOfChildren(0, 0, 0))).to.equal(false)
      })
    })
  })
})
