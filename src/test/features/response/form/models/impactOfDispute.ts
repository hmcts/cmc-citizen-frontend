/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { ImpactOfDispute, ValidationErrors } from 'response/form/models/impactOfDispute'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import * as randomstring from 'randomstring'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('ImpactOfDispute', () => {
  context('validation', () => {
    const validator: Validator = new Validator()

    it('should be valid when given a non-empty string', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute('non empty text')
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.be.empty
    })

    it('should be valid when given max amount of characters', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute(randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH))
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.be.empty
    })

    it('should be invalid when given empty string', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute('')
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.have.lengthOf(1)
      expectValidationError(errors, ValidationErrors.IMPACT_OF_DISPUTE_REQUIRED)
    })

    it('should be invalid when given undefined', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute(undefined)
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.have.lengthOf(1)
      expectValidationError(errors, ValidationErrors.IMPACT_OF_DISPUTE_REQUIRED)
    })

    it('should be invalid when given too many characters', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute(randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1))
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.have.lengthOf(1)
      expectValidationError(errors, ValidationErrors.IMPACT_OF_DISPUTE_TOO_LONG)
    })
  })
})
