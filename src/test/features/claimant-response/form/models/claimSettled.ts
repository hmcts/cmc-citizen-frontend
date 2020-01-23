import { expect } from 'chai'

import { YesNoOption } from 'models/yesNoOption'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'

describe('ClaimSettled', () => {

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new ClaimSettled(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new ClaimSettled(YesNoOption.fromObject('invalid')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept when recognised option', () => {
      YesNoOption.all().forEach(type => {
        const errors = validator.validateSync(new ClaimSettled(type))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = ClaimSettled.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('empty object when unknown value provided', () => {
      const model = ClaimSettled.fromObject({ accepted: 'unknown' })

      expect(model.accepted).to.be.eq(undefined)
    })

    YesNoOption.all().forEach(item => {
      it(`valid object when ${item.option} provided`, () => {
        const model = ClaimSettled.fromObject({ accepted: item.option })

        expect(model.accepted).to.be.eq(item)
      })
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new ClaimSettled().deserialize(undefined)).to.be.eql(new ClaimSettled())
    })

    YesNoOption.all().forEach(item => {
      it('should return an instance from given object', () => {
        const actual: ClaimSettled = new ClaimSettled().deserialize({ accepted: item })

        expect(actual).to.be.eql(new ClaimSettled(item))
      })
    })

  })

})
