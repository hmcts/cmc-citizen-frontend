import { expect } from 'chai'

import { YesNoOption } from 'models/yesNoOption'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'

describe('PartPaymentReceived', () => {
  describe('Validation', () => {
    const validator: Validator = new Validator()

    it('Should reject an undefined option', () => {
      const errors = validator.validateSync(new PartPaymentReceived(undefined))

      expect(errors).to.be.length(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('Should reject an invalid option', () => {
      const errors = validator.validateSync(new PartPaymentReceived(YesNoOption.fromObject('invalid option')))

      expect(errors).to.be.length(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })
  })

  describe('deserialize', () => {
    it('Should return an object with undefined defaults for undefined inputs', () => {
      expect(new PartPaymentReceived().deserialize(undefined)).to.be.deep.equal(new PartPaymentReceived())
    })

    YesNoOption.all().forEach(item => {
      it('Should return a valid instance for the given object', () => {
        expect(new PartPaymentReceived().deserialize({ received: item })).to.be.eql(new PartPaymentReceived(item))
      })
    })
  })

  describe('fromObject', () => {
    YesNoOption.all().forEach(item => {
      it(`Should return a valid object when ${item.option} is provided`, () => {
        const model: PartPaymentReceived = PartPaymentReceived.fromObject({ received: item.option })
        expect(model.received).to.be.eql(item)
      })
    })

    it('Should return undefined when undefined provided', () => {
      const model = PartPaymentReceived.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('Should return an empty object when unknown value provided', () => {
      const model = PartPaymentReceived.fromObject({ accepted: 'unknown' })

      expect(model.received).to.be.eq(undefined)
    })
  })
})
