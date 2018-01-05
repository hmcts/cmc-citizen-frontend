import { expect } from 'chai'

import { AtLeastOneFieldIsPopulatedConstraint } from 'forms/validation/validators/atLeastOneFieldIsPopulated'

describe('AtLeastOneFieldIsPopulatedConstraint', () => {
  const constraint: AtLeastOneFieldIsPopulatedConstraint = new AtLeastOneFieldIsPopulatedConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {

      it('undefined given', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('all fields are populated with positive numbers', () => {
        expect(constraint.validate({ a: 1, b: 100, c: 1.1 })).to.be.eq(true)
      })

      it('all fields are populated with negative numbers', () => {
        expect(constraint.validate({ a: -1, b: -100, c: -1.1 })).to.be.eq(true)
      })

      it('all fields are populated with blank strings', () => {
        expect(constraint.validate({ a: '\t', b: '\n', c: '    ' })).to.be.eq(true)
      })

      it('all fields are populated with nested objects', () => {
        expect(constraint.validate({ a: {}, b: [] })).to.be.eq(true)
      })

      it('only one field is populated', () => {
        expect(constraint.validate({ a: 1, b: undefined, c: '' })).to.be.eq(true)
      })

      it('object has keys with special characters in name', () => {
        expect(constraint.validate({ 'thi%s*my^^key': 1, b: undefined, c: '' })).to.be.eq(true)
      })
    })

    describe('should return false when ', () => {

      it('empty strings given', () => {
        expect(constraint.validate({ a: '', b: '', c: '' })).to.equal(false)
      })

      it('undefined values given', () => {
        expect(constraint.validate({ a: undefined, b: undefined })).to.equal(false)
      })

      it('all field populated with zeros', () => {
        expect(constraint.validate({ a: 0, b: 0, c: 0 })).to.equal(false)
      })

      it('empty object', () => {
        expect(constraint.validate({})).to.be.eq(false)
      })
    })
  })
})
