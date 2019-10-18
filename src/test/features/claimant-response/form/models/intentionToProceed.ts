import { expect } from 'chai'

import { YesNoOption } from 'models/yesNoOption'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IntentionToProceed } from 'claimant-response/form/models/intentionToProceed'

describe('IntentionToProceed', () => {

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new IntentionToProceed(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new IntentionToProceed(YesNoOption.fromObject('invalid')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept when recognised option', () => {
      YesNoOption.all().forEach(type => {
        const errors = validator.validateSync(new IntentionToProceed(type))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = IntentionToProceed.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('empty object when unknown value provided', () => {
      const model = IntentionToProceed.fromObject({ admitted: 'I do not know this value!' })

      expect(model.proceed).to.be.eq(undefined)
    })

    YesNoOption.all().forEach(item => {
      it(`valid object when ${item.option} provided`, () => {
        const model = IntentionToProceed.fromObject({ proceed: item.option })

        expect(model.proceed).to.be.eq(item)
      })
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new IntentionToProceed().deserialize(undefined)).to.be.eql(new IntentionToProceed())
    })

    YesNoOption.all().forEach(item => {
      it('should return an instance from given object', () => {
        const actual: IntentionToProceed = new IntentionToProceed().deserialize({ proceed: item })

        expect(actual).to.be.eql(new IntentionToProceed(item))
      })
    })

  })

})
