import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { Eligibility } from 'eligibility/model/eligibility'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimValue } from 'features/eligibility/model/claimValue'
import { ClaimType } from 'features/eligibility/model/claimType'
import { DefendantAgeOption } from 'features/eligibility/model/defendantAgeOption'

describe('Eligibility', () => {

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject eligibility if not complete', () => {
      const errors = validator.validateSync(
        new Eligibility(
          ClaimValue.UNDER_10000,
          YesNoOption.NO,
          YesNoOption.YES,
          YesNoOption.YES,
          YesNoOption.YES,
          DefendantAgeOption.YES,
          ClaimType.PERSONAL_CLAIM,
          YesNoOption.YES,
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
          ClaimValue.UNDER_10000,
          YesNoOption.NO,
          YesNoOption.YES,
          YesNoOption.YES,
          YesNoOption.YES,
          DefendantAgeOption.YES,
          ClaimType.PERSONAL_CLAIM,
          YesNoOption.NO,
          YesNoOption.NO,
          YesNoOption.NO
        )
      )

      expect(errors.length).to.equal(0)
    })
  })

  describe('eligible', () => {

    it('should be valid if all eligibility answers are eligible', () => {

      const eligibility = new Eligibility(
        ClaimValue.UNDER_10000,
        YesNoOption.NO,
        YesNoOption.YES,
        YesNoOption.YES,
        YesNoOption.YES,
        DefendantAgeOption.COMPANY_OR_ORGANISATION,
        ClaimType.PERSONAL_CLAIM,
        YesNoOption.NO,
        YesNoOption.NO,
        YesNoOption.NO
      )

      expect(eligibility.eligible).to.equal(true)

    })

    it('should be invalid if any eligibility answer is not eligible', () => {

      const eligibility = new Eligibility(
        ClaimValue.UNDER_10000,
        YesNoOption.NO,
        YesNoOption.YES,
        YesNoOption.YES,
        YesNoOption.YES,
        DefendantAgeOption.NO,
        ClaimType.PERSONAL_CLAIM,
        YesNoOption.NO,
        YesNoOption.NO,
        YesNoOption.NO
      )

      expect(eligibility.eligible).to.equal(false)

    })
  })

})
