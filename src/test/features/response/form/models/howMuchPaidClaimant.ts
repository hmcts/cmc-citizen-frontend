import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { HowMuchPaidClaimant, HowMuchPaidClaimantOption, ValidationErrors } from 'response/form/models/howMuchPaidClaimant'

describe('HowMuchPaidClaimant', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new HowMuchPaidClaimant(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new HowMuchPaidClaimant('reject all'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should accept when recognised option', () => {
      HowMuchPaidClaimantOption.all().forEach(type => {
        const errors = validator.validateSync(new HowMuchPaidClaimant(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
