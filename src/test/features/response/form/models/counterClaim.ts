import { expect } from 'chai'

import { Validator } from 'class-validator'
import { CounterClaim, ValidationErrors } from 'response/form/models/counterClaim'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'

describe('CounterClaim', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new CounterClaim(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject with invalid value', () => {
      const errors = validator.validateSync(CounterClaim.fromObject('maybe'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should accept with recognised type', () => {
      [{ counterClaim: true }, { counterClaim: false }, { counterClaim: 'true' }, { counterClaim: 'false' }].forEach(type => {
        const object = CounterClaim.fromObject(type)
        const errors = validator.validateSync(object)

        expect(errors.length).to.equal(0)
      })
    })
  })
})
