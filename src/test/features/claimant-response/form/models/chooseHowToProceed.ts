import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import {
  ChooseHowToProceed,
  ChooseHowToProceedOption,
  ValidationErrors
} from 'claimant-response/form/models/chooseHowToProceed'

describe('ChooseHowToProceed', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new ChooseHowToProceed(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject with invalid value', () => {
      const errors = validator.validateSync(new ChooseHowToProceed('invalid'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should accept chooseHowToProceed with recognised type', () => {
      ChooseHowToProceedOption.all().forEach(type => {
        const errors = validator.validateSync(new ChooseHowToProceed(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
