/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('SettlementAgreement', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const settlementAgreement = new SettlementAgreement()
      expect(settlementAgreement.signed).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject settlement agreement with null type', () => {
      const errors = validator.validateSync(new SettlementAgreement(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.DECLARATION_REQUIRED)
    })

    it('should reject settlement agreement without signature', () => {
      const errors = validator.validateSync(new SettlementAgreement())

      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.DECLARATION_REQUIRED)
    })

    it('should reject settlement agreement with undefined', () => {
      const errors = validator.validateSync(new SettlementAgreement(undefined))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.DECLARATION_REQUIRED)
    })

    it('should accept settlement agreement with signature', () => {
      const errors = validator.validateSync(new SettlementAgreement(true))
      expect(errors.length).to.equal(0)
    })

  })
})
