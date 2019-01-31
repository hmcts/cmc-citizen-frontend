import { ValidationErrors, Explanation } from 'response/form/models/statement-of-means/explanation'
import { ValidationError, Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

describe('Explanation', () => {
  context('validation', () => {
    const validator: Validator = new Validator()

    it('should have validation errors if text is not provided', () => {
      const errors: ValidationError[] = validator.validateSync(new Explanation())
      expectValidationError(errors, ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW)
    })

    it('should have validation errors if given a blank string', () => {
      const errors: ValidationError[] = validator.validateSync(new Explanation(''))
      expectValidationError(errors, ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW)
    })

    it('should have validation errors if given a whitespace string', () => {
      const errors: ValidationError[] = validator.validateSync(new Explanation('    '))
      expectValidationError(errors, ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW)
    })

    it('should have validation errors if given too many characters', () => {
      const errors: ValidationError[] = validator.validateSync(new Explanation(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)))
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })
  })
})
