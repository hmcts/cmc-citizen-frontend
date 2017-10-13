import { expect } from 'chai'

import { TimelineRow, ValidationConstants, ValidationErrors } from 'response/form/models/timelineRow'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import * as randomstring from 'randomstring'

describe('TimelineRow', () => {

  describe('empty', () => {

    it('should return empty instances of TimelineRow', () => {

      const actual: TimelineRow = TimelineRow.empty()

      expect(actual).instanceof(TimelineRow)
      expect(actual.date).to.eq(undefined)
      expect(actual.description).to.eq(undefined)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {
      it('when both undefined', () => {
        const errors = validator.validateSync(new TimelineRow(undefined, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when both are valid strings', () => {
        const errors = validator.validateSync(new TimelineRow('Date', 'description'))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {
      it('when date given, but no description', () => {
        const errors = validator.validateSync(new TimelineRow('May', ''))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DESCRIPTION_REQUIRED)
      })

      it('when description given, but no date', () => {
        const errors = validator.validateSync(new TimelineRow('', 'Let me tell you what happened'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
      })

      it('when both args are empty strings', () => {
        const errors = validator.validateSync(new TimelineRow('', ''))

        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
        expectValidationError(errors, ValidationErrors.DESCRIPTION_REQUIRED)
      })

      it('when date is too long', () => {
        const errors = validator.validateSync(
          new TimelineRow(generateRandomString(ValidationConstants.DATE_MAX_LENGTH + 1), 'description')
        )

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, ValidationErrors.DATE_TOO_LONG.replace('$constraint1', ValidationConstants.DATE_MAX_LENGTH + '')
        )
      })

      it('when description is too long', () => {
        const errors = validator.validateSync(
          new TimelineRow('date', generateRandomString(ValidationConstants.DESCRIPTION_MAX_LENGTH + 1))
        )

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, ValidationErrors.DESCRIPTION_TOO_LONG.replace('$constraint1', ValidationConstants.DESCRIPTION_MAX_LENGTH + '')
        )
      })
    })
  })
})

function generateRandomString (len: number) {
  return randomstring.generate({
    length: len,
    charset: 'alphabetic'
  })
}
