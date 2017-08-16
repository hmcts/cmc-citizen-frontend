import { expect } from 'chai'

import { ValidationArguments } from 'class-validator'

import { IsValidYearFormatConstraint } from 'forms/validation/validators/isValidYearFormat'

import { LocalDate } from 'forms/models/localDate'

describe('isValidYearFormat', () => {
  const constraint: IsValidYearFormatConstraint = new IsValidYearFormatConstraint()
  const errorMessage: string = 'Allowed digits in year have to be specified and positive value'

  describe('validate', () => {

    it('should throw an error if digits constraint is not set', () => {
      expect(() => constraint.validate(null, validationArgs(undefined))).to.throw(Error, errorMessage)
    })

    it('should throw an error if digits constraint is null', () => {
      expect(() => constraint.validate(null, validationArgs(null))).to.throw(Error, errorMessage)
    })

    it('should throw an error if digits constraint is zero', () => {
      expect(() => constraint.validate(null, validationArgs(0))).to.throw(Error, errorMessage)
    })

    it('should throw an error if digits constraint is negative', () => {
      expect(() => constraint.validate(null, validationArgs(-1))).to.throw(Error, errorMessage)
    })

    it('should reject values other then LocalDate', () => {
      expect(constraint.validate({}, validationArgs(4))).to.be.equal(false)
    })

    it('should reject values with invalid digits', () => {
      expect(constraint.validate(new LocalDate(90, 12, 31), validationArgs(4))).to.be.equal(false)
    })

    it('should accept undefined value', () => {
      expect(constraint.validate(undefined, validationArgs(4))).to.be.equal(true)
    })

    it('should accept null value', () => {
      expect(constraint.validate(null, validationArgs(4))).to.be.equal(true)
    })

    it('should accept date with valid digits in year', () => {
      expect(constraint.validate(new LocalDate(2017, 12, 31), validationArgs(4))).to.be.equal(true)
    })
  })
})

function validationArgs (digits: number): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: undefined,
    property: undefined,
    constraints: [digits]
  }
}
