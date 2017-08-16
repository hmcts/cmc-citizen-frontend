import { expect } from 'chai'
import { IsBooleanTrueConstraint } from 'forms/validation/validators/isBooleanTrue'

describe('IsBooleanConstraint', () => {
  const constraint: IsBooleanTrueConstraint = new IsBooleanTrueConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given a valid case', () => {
        expect(constraint.validate(true)).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given an invalid case', () => {
        expect(constraint.validate(false)).to.equal(false)
      })
      it('given null', () => {
        expect(constraint.validate(null)).to.equal(false)
      })
      it('given undefined', () => {
        expect(constraint.validate(undefined)).to.equal(false)
      })
    })
  })
})
