import { expect } from 'chai'

import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { Validator } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

describe('AlreadyPaid', () => {

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new AlreadyPaid(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new AlreadyPaid(YesNoOption.fromObject('invalid')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept when recognised option', () => {
      YesNoOption.all().forEach(type => {
        const errors = validator.validateSync(new AlreadyPaid(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
