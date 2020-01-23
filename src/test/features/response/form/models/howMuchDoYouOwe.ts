import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { ValidationErrors } from 'forms/validation/validationErrors'

const claimAmount = 5000
const amountOwed = 2000

describe('HowMuchDoYouOwe', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined', () => {
      const errors = validator.validateSync(new HowMuchDoYouOwe(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
    })

    it('should reject when value is negative', () => {
      const errors = validator.validateSync(new HowMuchDoYouOwe(-amountOwed, claimAmount))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
    })

    it('should reject when value is 0', () => {
      const errors = validator.validateSync(new HowMuchDoYouOwe(0, claimAmount))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
    })

    it('should reject when value is more then two decimal places', () => {
      const errors = validator.validateSync(new HowMuchDoYouOwe(3.1415926, claimAmount))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
    })

    it('should reject when amount entered is more then claimed', () => {
      const errors = validator.validateSync(new HowMuchDoYouOwe(9000, claimAmount))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_ENTERED_TOO_LARGE)
    })

    it('should accept when recognised option', () => {
      const errors = validator.validateSync(new HowMuchDoYouOwe(amountOwed, claimAmount))

      expect(errors.length).to.equal(0)
    })
  })
})
