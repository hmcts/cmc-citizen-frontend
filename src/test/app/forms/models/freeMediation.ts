import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { FreeMediation, FreeMediationOption, ValidationErrors } from 'forms/models/freeMediation'

describe('FreeMediation', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new FreeMediation(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject with invalid value', () => {
      const errors = validator.validateSync(new FreeMediation('maybe'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should accept mediation with recognised type', () => {
      FreeMediationOption.all().forEach(type => {
        const errors = validator.validateSync(new FreeMediation(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
