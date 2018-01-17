import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../../app/forms/models/validationUtils'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'

describe('Eligibility', () => {

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject eligibility if not complete', () => {
      const errors = validator.validateSync(
        new Eligibility(
          YesNoOption.YES,
          YesNoOption.YES,
          ClaimValue.UNDER_10000,
          YesNoOption.YES,
          YesNoOption.YES,
          YesNoOption.YES,
          YesNoOption.NO,
          undefined,
          YesNoOption.NO
        )
      )
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should be valid if all eligibility provided', () => {
      const errors = validator.validateSync(
        new Eligibility(
          YesNoOption.YES,
          YesNoOption.YES,
          ClaimValue.UNDER_10000,
          YesNoOption.YES,
          YesNoOption.YES,
          YesNoOption.YES,
          YesNoOption.NO,
          YesNoOption.NO,
          YesNoOption.NO
        )
      )

      expect(errors.length).to.equal(0)
    })
  })

})
