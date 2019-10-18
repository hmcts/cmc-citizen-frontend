import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { DefendantResponse, ValidationErrors } from 'offer/form/models/defendantResponse'
import { StatementType } from 'offer/form/models/statementType'

describe('DefendantResponse', () => {

  describe('constructor', () => {

    it('should set the fields to undefined', () => {
      const defendantResponse = new DefendantResponse()
      expect(defendantResponse.option).to.be.equal(undefined)
    })
  })

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(DefendantResponse.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(DefendantResponse.fromObject({})).to.deep.equal(new DefendantResponse())
    })

    it('should deserialize all fields', () => {
      expect(DefendantResponse.fromObject({ option: StatementType.ACCEPTATION.value })).to.deep.equal(new DefendantResponse(StatementType.ACCEPTATION))
    })
  })

  describe('deserialization', () => {

    it('should return instance initialised with defaults given undefined', () => {
      expect(new DefendantResponse().deserialize(undefined)).to.deep.equal(new DefendantResponse())
    })

    it('should return instance with set fields from given object', () => {
      expect(new DefendantResponse().deserialize({ option: StatementType.ACCEPTATION.value })).to.deep.equal(new DefendantResponse(StatementType.ACCEPTATION))
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    describe('should reject when', () => {

      it('undefined option', () => {
        const errors = validator.validateSync(new DefendantResponse(undefined))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })
    })

    describe('should accept when', () => {

      context('valid form with selected option', () => {

        it('Acceptation', () => {
          const errors = validator.validateSync(new DefendantResponse(StatementType.ACCEPTATION))
          expect(errors.length).to.equal(0)
        })

        it('Rejection', () => {
          const errors = validator.validateSync(new DefendantResponse(StatementType.REJECTION))
          expect(errors.length).to.equal(0)
        })

        it('Make Counter Offer', () => {
          const errors = validator.validateSync(new DefendantResponse(StatementType.OFFER))
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
