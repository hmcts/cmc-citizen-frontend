import { expect } from 'chai'

import { Validator } from 'class-validator'
import { EmployerRow, ValidationErrors } from 'response/form/models/statement-of-means/employerRow'
import { expectValidationError, generateString } from '../../../../../app/forms/models/validationUtils'
import { ValidationConstraints as GlobalValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('EmployerRow', () => {

  describe('empty', () => {

    it('should return empty instances of EmployerRow', () => {

      const actual: EmployerRow = EmployerRow.empty()

      expect(actual).instanceof(EmployerRow)
      expect(actual.jobTitle).to.eq(undefined)
      expect(actual.employerName).to.eq(undefined)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {
      it('when both undefined', () => {
        const errors = validator.validateSync(new EmployerRow(undefined, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when both are valid strings', () => {
        const errors = validator.validateSync(new EmployerRow('employerName', 'jobTitle'))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when employerName given, but no jobTitle', () => {
        const errors = validator.validateSync(new EmployerRow('employerName', ''))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.JOB_TITLE_REQUIRED)
      })

      it('when jobTitle given, but no employerName', () => {
        const errors = validator.validateSync(new EmployerRow('', 'director'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.EMPLOYER_NAME_REQUIRED)
      })

      it('when both args are empty strings', () => {
        const errors = validator.validateSync(new EmployerRow('', ''))

        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.EMPLOYER_NAME_REQUIRED)
        expectValidationError(errors, ValidationErrors.JOB_TITLE_REQUIRED)
      })

      it('when employerName is too long', () => {
        const errors = validator.validateSync(
          new EmployerRow(generateString(GlobalValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 'dev')
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.TOO_LONG_INPUT)
      })

      it('when jobTitle is too long', () => {
        const errors = validator.validateSync(
          new EmployerRow('employer', generateString(GlobalValidationConstraints.FREE_TEXT_MAX_LENGTH + 1))
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.TOO_LONG_INPUT)
      })
    })
  })
})
