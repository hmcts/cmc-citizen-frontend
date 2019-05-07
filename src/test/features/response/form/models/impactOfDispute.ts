/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { ImpactOfDispute } from 'response/form/models/impactOfDispute'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import * as randomstring from 'randomstring'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('ImpactOfDispute', () => {
  context('validation', () => {
    const validator: Validator = new Validator()

    it('should be valid when given max amount of characters', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute(randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH))
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.be.empty
    })

    it('should be valid when given empty string', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute('')
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.be.empty
    })

    it('should be valid when given undefined', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute(undefined)
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.be.empty
    })

    it('should be invalid when given too many characters', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute(randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1))
      const errors = validator.validateSync(impactOfDispute)
      expect(errors).to.have.lengthOf(1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })
  })

  context('deserialisation', () => {
    it('should use the text from provided object', () => {
      const testContent = 'I a test string'
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute().deserialize({ text: testContent })
      expect(impactOfDispute.text).to.equal(testContent)
    })

    it('should set text to undefined if given undefined as input', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute().deserialize(undefined)
      expect(impactOfDispute.text).to.be.undefined
    })
  })

  context('new instance creation', () => {
    it('should set the text to undefined for new instance', () => {
      const impactOfDispute: ImpactOfDispute = new ImpactOfDispute()
      expect(impactOfDispute.text).to.be.undefined
    })
  })
})
