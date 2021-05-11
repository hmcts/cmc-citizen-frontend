import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { NoMediationReason, ValidationErrors } from 'mediation/form/models/NoMediationReason'
import { NoMediationReasonOptions } from 'mediation/form/models/NoMediationReasonOptions'

describe('NoMediationReason', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined iDoNotWantMediationReason', () => {
      const errors = validator.validateSync(new NoMediationReason(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject with invalid value', () => {
      const errors = validator.validateSync(new NoMediationReason('not interested'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should accept reason with recognised type', () => {
      const errors = validator.validateSync(new NoMediationReason(NoMediationReasonOptions.ALREADY_TRIED))

      expect(errors.length).to.equal(0)
    })
  })
})
