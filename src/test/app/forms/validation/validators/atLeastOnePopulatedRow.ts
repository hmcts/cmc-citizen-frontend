import { expect } from 'chai'

import { AtLeastOnePopulatedRowConstraint } from 'forms/validation/validators/atLeastOnePopulatedRow'

const EMPTY: boolean = true
const POPULATED: boolean = false

describe('AtLeastOnePopulatedRowConstraint', () => {
  const constraint: AtLeastOnePopulatedRowConstraint = new AtLeastOnePopulatedRowConstraint()

  describe('validate', () => {

    context('should accept', () => {

      it('should accept undefined value', () => {
        expect(constraint.validate(undefined)).to.be.equal(true)
      })

      it('array of populated objects', () => {
        expect(
          constraint.validate([buildObject(POPULATED), buildObject(POPULATED), buildObject(POPULATED)])
        ).to.be.equal(true)
      })

      it('array with only one populated object', () => {
        expect(constraint.validate([buildObject(POPULATED)])).to.be.equal(true)
      })

      it('array with many objects, but only one populated', () => {
        expect(
          constraint.validate(
            [
              buildObject(EMPTY), buildObject(EMPTY),
              buildObject(POPULATED),
              buildObject(EMPTY), buildObject(EMPTY)]
          )
        ).to.be.equal(true)
      })
    })

    context('should reject', () => {

      it('empty object', () => {
        expect(constraint.validate({})).to.be.equal(false)
      })

      it('empty array', () => {
        expect(constraint.validate([])).to.be.equal(false)
      })

      it('array of empty objects', () => {
        expect(constraint.validate([buildObject(EMPTY), buildObject(EMPTY)])).to.be.equal(false)
      })
    })
  })
})

function buildObject (isEmpty: boolean) {
  return {
    isEmpty: () => isEmpty
  }
}
