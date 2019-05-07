import { expect } from 'chai'

import { YesNoOption } from 'models/yesNoOption'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'

describe('SettleAdmitted', () => {

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new SettleAdmitted(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new SettleAdmitted(YesNoOption.fromObject('invalid')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept when recognised option', () => {
      YesNoOption.all().forEach(type => {
        const errors = validator.validateSync(new SettleAdmitted(type))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = SettleAdmitted.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('empty object when unknown value provided', () => {
      const model = SettleAdmitted.fromObject({ admitted: 'I do not know this value!' })

      expect(model.admitted).to.be.eq(undefined)
    })

    YesNoOption.all().forEach(item => {
      it(`valid object when ${item.option} provided`, () => {
        const model = SettleAdmitted.fromObject({ admitted: item.option })

        expect(model.admitted).to.be.eq(item)
      })
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new SettleAdmitted().deserialize(undefined)).to.be.eql(new SettleAdmitted())
    })

    YesNoOption.all().forEach(item => {
      it('should return an instance from given object', () => {
        const actual: SettleAdmitted = new SettleAdmitted().deserialize({ admitted: item })

        expect(actual).to.be.eql(new SettleAdmitted(item))
      })
    })

  })

})
