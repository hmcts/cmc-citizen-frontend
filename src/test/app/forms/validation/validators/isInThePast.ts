import { expect } from 'chai'

import { ValidationArguments } from '@hmcts/class-validator'
import * as moment from 'moment'

import { MinimumAgeValidatorConstraint } from 'forms/validation/validators/minimumAgeValidator'
import { MaximumAgeValidatorConstraint } from 'forms/validation/validators/maximumAgeValidator'

import { LocalDate } from 'forms/models/localDate'

describe('MinimumAgeValidatorConstraint', () => {
  const constraint: MinimumAgeValidatorConstraint = new MinimumAgeValidatorConstraint()
  const minMessage: string = 'Min Years in the past has to be specified and positive value'

  describe('validate', () => {
    const today = moment()

    it('should throw an error if minYears constraint is not set', () => {
      expect(() => constraint.validate(null, yearsLimit(undefined))).to.throw(Error, minMessage)
    })

    it('should accept past date grater than minimum age', () => {
      expect(constraint.validate(new LocalDate(today.year() - 19, today.month() + 1, today.date()), yearsLimit(18))).to.be.equal(true)
    })

    it('should accept undefined value', () => {
      expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true)
    })

    it('should accept undefined value', () => {
      expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true)
    })

    it('should reject values other then LocalDate', () => {
      expect(constraint.validate({}, yearsLimit(1))).to.be.equal(false)
    })

    it('should reject future date', () => {
      expect(constraint.validate(new LocalDate(today.year(), today.month() + 1, today.date() + 1), yearsLimit(1))).to.be.equal(false)
    })

    it('should reject current date', () => {
      expect(constraint.validate(new LocalDate(today.year(), today.month() + 1, today.date()), yearsLimit(1))).to.be.equal(false)
    })

    it('should reject past date out of the range', () => {
      expect(constraint.validate(new LocalDate(today.year() - 17, today.month() + 1, today.date()), yearsLimit(18))).to.be.equal(false)
    })

    it('should accept past date within range', () => {
      expect(constraint.validate(new LocalDate(today.year() - 1, today.month() + 1, today.date()), yearsLimit(1))).to.be.equal(true)
    })
  })
})

describe('MaximumAgeValidatorConstraint', () => {
  const constraint: MaximumAgeValidatorConstraint = new MaximumAgeValidatorConstraint()
  const maxMessage: string = 'Max Years in the past has to be specified and positive value'

  describe('validate', () => {
    const today = moment()

    it('should throw an error if maxYears constraint is not set', () => {
      expect(() => constraint.validate(null, yearsLimit(undefined))).to.throw(Error, maxMessage)
    })

    it('should accept past date lesser than maximum age', () => {
      expect(constraint.validate(new LocalDate(today.year() - 149, today.month() + 1, today.date()), yearsLimit(150))).to.be.equal(true)
    })

    it('should accept undefined value', () => {
      expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true)
    })

    it('should accept undefined value', () => {
      expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true)
    })

    it('should reject values other then LocalDate', () => {
      expect(constraint.validate({}, yearsLimit(1))).to.be.equal(false)
    })

    it('should reject past date out of the range', () => {
      expect(constraint.validate(new LocalDate(today.year() - 151, today.month() + 1, today.date()), yearsLimit(150))).to.be.equal(false)
    })

    it('should accept past date within range', () => {
      expect(constraint.validate(new LocalDate(today.year() - 1, today.month() + 1, today.date()), yearsLimit(1))).to.be.equal(true)
    })
  })
})

function yearsLimit (value: number): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: undefined,
    property: undefined,
    constraints: [value]
  }
}
