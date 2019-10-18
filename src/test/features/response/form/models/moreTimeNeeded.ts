import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { MoreTimeNeeded, MoreTimeNeededOption, ValidationErrors } from 'response/form/models/moreTimeNeeded'

describe('MoreTimeNeeded', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new MoreTimeNeeded(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject with invalid value', () => {
      const errors = validator.validateSync(new MoreTimeNeeded('maybe'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should accept mediation with recognised type', () => {
      MoreTimeNeededOption.all().forEach(type => {
        const errors = validator.validateSync(new MoreTimeNeeded(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
