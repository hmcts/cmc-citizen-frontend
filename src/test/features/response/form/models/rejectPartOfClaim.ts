import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { RejectPartOfClaim, RejectPartOfClaimOption, ValidationErrors } from 'response/form/models/rejectPartOfClaim'

describe('RejectPartOfClaim', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new RejectPartOfClaim(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject with invalid value', () => {
      const errors = validator.validateSync(new RejectPartOfClaim('reject part'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should accept mediation with recognised type', () => {
      RejectPartOfClaimOption.all().forEach(type => {
        const errors = validator.validateSync(new RejectPartOfClaim(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
