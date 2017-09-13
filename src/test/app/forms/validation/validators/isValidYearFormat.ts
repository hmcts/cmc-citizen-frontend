import { expect } from 'chai'

import { ValidationArguments } from 'class-validator'

import { IsValidYearFormatConstraint } from 'forms/validation/validators/isValidYearFormat'

import { LocalDate } from 'forms/models/localDate'

describe('isValidYearFormat', () => {
  const constraint: IsValidYearFormatConstraint = new IsValidYearFormatConstraint()

  describe('validate', () => {

    it('should reject values other then LocalDate', () => {
      expect(constraint.validate({}, validationArgs())).to.be.equal(false)
    })

    it('should reject values with invalid digits', () => {
      expect(constraint.validate(new LocalDate(90, 12, 31), validationArgs())).to.be.equal(false)
    })

    it('should accept undefined value', () => {
      expect(constraint.validate(undefined, validationArgs())).to.be.equal(true)
    })

    it('should accept date with valid digits in year', () => {
      expect(constraint.validate(new LocalDate(2017, 12, 31), validationArgs())).to.be.equal(true)
    })
  })
})

function validationArgs (): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: undefined,
    property: undefined,
    constraints: []
  }
}
