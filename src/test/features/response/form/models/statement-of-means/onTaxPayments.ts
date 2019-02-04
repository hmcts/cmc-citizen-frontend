import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors, OnTaxPayments } from 'response/form/models/statement-of-means/onTaxPayments'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

describe('OnTaxPayments', () => {

  describe('deserialize', () => {

    it('should return empty OnTaxPayments for undefined given as input', () => {
      const actual = new OnTaxPayments().deserialize(undefined)

      expect(actual).to.be.instanceof(OnTaxPayments)
      expect(actual.declared).to.be.eq(undefined)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })

    it('should return OnTaxPayments with populated only declared', () => {
      const actual = new OnTaxPayments().deserialize({ declared: false })

      expect(actual.declared).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })

    it('should return fully populated OnTaxPayments', () => {
      const actual = new OnTaxPayments().deserialize(
        { declared: true, amountYouOwe: 100, reason: 'Various taxes' }
      )

      expect(actual.declared).to.be.eq(true)
      expect(actual.amountYouOwe).to.be.eq(100)
      expect(actual.reason).to.be.eq('Various taxes')
    })

    it('should NOT populate other fields when declared = false', () => {
      const actual = new OnTaxPayments().deserialize(
        { declared: false, amountYouOwe: 100, reason: 'Various taxes' }
      )

      expect(actual.declared).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return empty OnTaxPayments for undefined given as input', () => {
      const actual = OnTaxPayments.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return OnTaxPayments with populated only declared', () => {
      const actual = OnTaxPayments.fromObject({ declared: false })

      expect(actual.declared).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })

    it('should return fully populated OnTaxPayments', () => {
      const actual = OnTaxPayments.fromObject(
        { declared: true, amountYouOwe: 100, reason: 'Various taxes' }
      )

      expect(actual.declared).to.be.eq(true)
      expect(actual.amountYouOwe).to.be.eq(100)
      expect(actual.reason).to.be.eq('Various taxes')
    })

    it('should NOT populate other fields when declared = false', () => {
      const actual = OnTaxPayments.fromObject(
        { declared: false, amountYouOwe: 100, reason: 'Various taxes' }
      )

      expect(actual.declared).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when declared is', () => {

      context('undefined', () => {

        it('should reject', () => {
          const errors = validator.validateSync(new OnTaxPayments())

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
        })
      })

      context('true', () => {

        context('should reject when', () => {

          it('all are not given', () => {
            const errors = validator.validateSync(
              new OnTaxPayments(true, undefined, undefined)
            )

            expect(errors.length).to.equal(2)
            expectValidationError(errors, GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED)
            expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
          })

          it('amount is negative', () => {
            const errors = validator.validateSync(
              new OnTaxPayments(true, -1, 'Taxes')
            )

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED)
          })

          it('amount is set to 0', () => {
            const errors = validator.validateSync(new OnTaxPayments(true, 0, 'Taxes'))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED)
          })

          it('amount has more then two decimal points', () => {
            const errors = validator.validateSync(new OnTaxPayments(true, 0.001, 'Taxes'))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED)
          })

          it('reason is blank', () => {
            const errors = validator.validateSync(
              new OnTaxPayments(true, 0.01, '')
            )

            expect(errors.length).to.equal(1)
            expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
          })
        })

        context('should accept when', () => {

          it('values are valid', () => {
            const errors = validator.validateSync(new OnTaxPayments(true, 0.01, 'Taxes'))

            expect(errors.length).to.equal(0)
          })
        })
      })

      context('false', () => {
        context('should accept when', () => {

          it('amount and reason are undefined', () => {
            const errors = validator.validateSync(new OnTaxPayments(false, undefined, undefined))

            expect(errors.length).to.equal(0)
          })
        })
      })
    })
  })
})
