import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import {
  DefendantSettlementResponse,
  DefendantSettlementResponseOption,
  ValidationErrors
} from 'settlement-agreement/form/models/defendantSettlementResponse'

describe('DefendantSettlementResponse', () => {

  describe('constructor', () => {

    it('should set the fields to undefined when given no option', () => {
      const defendantSettlementResponse = new DefendantSettlementResponse()
      expect(defendantSettlementResponse.option).to.be.equal(undefined)
    })

    DefendantSettlementResponseOption.all().forEach((option) => {
      it(`Should set the field to ${option} when given ${option}`, () => {
        const defendantSettlementResponse = new DefendantSettlementResponse(option)
        expect(defendantSettlementResponse.option).to.be.equal(option)
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    describe('should reject when', () => {

      it('undefined option', () => {
        const errors = validator.validateSync(new DefendantSettlementResponse(undefined))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })
    })

    describe('should accept when', () => {

      context('valid form with selected option', () => {

        DefendantSettlementResponseOption.all().forEach((option) => {
          it(option, () => {
            const errors = validator.validateSync(new DefendantSettlementResponse(option))
            expect(errors).to.be.length(0)
          })
        })
      })
    })
  })
})
