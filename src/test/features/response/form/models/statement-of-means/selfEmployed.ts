import { expect } from 'chai'
import { SelfEmployment, ValidationErrors } from 'response/form/models/statement-of-means/selfEmployment'
import { Validator } from 'class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('SelfEmployment', () => {

  describe('deserialize', () => {

    it('should return empty SelfEmployed for undefined given as input', () => {
      const actual = new SelfEmployment().deserialize(undefined)

      expect(actual).to.be.instanceof(SelfEmployment)
      expect(actual.jobTitle).to.be.eq(undefined)
      expect(actual.annualTurnover).to.be.eq(undefined)
    })

    it('should return fully populated SelfEmployed', () => {
      const actual = new SelfEmployment().deserialize({
        jobTitle: 'my role', annualTurnover: 10
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given', () => {
      const actual = SelfEmployment.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return fully populated SelfEmployed', () => {
      const actual = SelfEmployment.fromObject({
        jobTitle: 'my role', annualTurnover: 10
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    context('should accept', () => {

      it('all fields given with valid values', () => {
        const errors = validator.validateSync(new SelfEmployment('My role', 1000))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject when', () => {

      it('in input', () => {
        const errors = validator.validateSync(new SelfEmployment())

        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.JOB_TITLE_REQUIRED)
        expectValidationError(errors, ValidationErrors.ANNUAL_TURNOVER_REQUIRED)
      })

      it('too long role name', () => {
        const errors = validator.validateSync(
          new SelfEmployment(
            generateString(GlobalValidationConstants.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 1000
          )
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
      })

      it('too many decimal digits for annualTurnover', () => {
        const errors = validator.validateSync(new SelfEmployment('my role', 10.111))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('too much annualTurnover', () => {
        const errors = validator.validateSync(
          new SelfEmployment('my role', GlobalValidationConstants.MAX_VALUE + 1)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_ENTERED_TOO_LARGE)
      })
    })
  })
})
