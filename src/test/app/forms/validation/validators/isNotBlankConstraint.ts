import { expect } from 'chai'

import { IsNotBlankConstraint } from 'forms/validation/validators/isBlank'

describe('IsNotBlankConstraint', () => {
  const constraint: IsNotBlankConstraint = new IsNotBlankConstraint()

  describe('validate', () => {

    it('should accept undefined value', () => {
      expect(constraint.validate(undefined)).to.be.equal(true)
    })

    it('should reject non string value', () => {
      expect(constraint.validate(true)).to.be.equal(false)
      expect(constraint.validate(999)).to.be.equal(false)
      expect(constraint.validate({})).to.be.equal(false)
    })

    it('should reject empty value', () => {
      expect(constraint.validate('')).to.be.equal(false)
    })

    it('should reject blank value', () => {
      expect(constraint.validate(' ')).to.be.equal(false)
    })

    it('should accept non blank value', () => {
      expect(constraint.validate('something')).to.be.equal(true)
    })
  })
})
