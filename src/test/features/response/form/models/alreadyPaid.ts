import { expect } from 'chai'

import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

describe('AlreadyPaid', () => {

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new AlreadyPaid(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new AlreadyPaid(YesNoOption.fromObject('invalid')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept when recognised option', () => {
      YesNoOption.all().forEach(type => {
        const errors = validator.validateSync(new AlreadyPaid(type))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = AlreadyPaid.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('empty object when unknown value provided', () => {
      const model = AlreadyPaid.fromObject({ option: 'I do not know this value!' })

      expect(model.option).to.be.eq(undefined)
    })

    YesNoOption.all().forEach(item => {
      it(`valid object when ${item.option} provided`, () => {
        const model = AlreadyPaid.fromObject({ option: item.option })

        expect(model.option).to.be.eq(item)
      })
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new AlreadyPaid().deserialize(undefined)).to.be.eql(new AlreadyPaid())
    })

    YesNoOption.all().forEach(item => {
      it('should return an instance from given object', () => {
        const actual: AlreadyPaid = new AlreadyPaid().deserialize({ option: item.option })

        expect(actual).to.be.eql(new AlreadyPaid(item))
      })
    })

  })

})
