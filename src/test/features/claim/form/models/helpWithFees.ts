/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors } from 'forms/validation/validationErrors'

import { YesNoOption } from 'models/yesNoOption'
import { HelpWithFees } from 'claim/form/models/helpWithFees'

describe('Help With Fees', () => {
  context('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(HelpWithFees.fromObject(undefined)).to.be.undefined
    })

    it('should leave missing fields undefined', () => {
      expect(HelpWithFees.fromObject({})).to.deep.equal(new HelpWithFees())
    })

    it('should deserialize all fields', () => {
      expect(HelpWithFees.fromObject({
        declared: YesNoOption.YES.option,
        helpWithFeesNumber: 'HWF01234'
      })).to.deep.equal(new HelpWithFees(YesNoOption.YES, 'HWF01234'))
    })
  })

  context('deserialize', () => {
    it('should return a HelpWithFees instance', () => {
      const deserialized = new HelpWithFees().deserialize({})
      expect(deserialized).to.be.instanceof(HelpWithFees)
    })

    it('should return a HelpWithFees instance with fields set to default values when given "undefined"', () => {
      const deserialized = new HelpWithFees().deserialize(undefined)
      expect(deserialized.declared).to.be.undefined
      expect(deserialized.helpWithFeesNumber).to.be.undefined
    })

    it('should return a HelpWithFees instance with fields set to default values when given "null"', () => {
      const deserialized = new HelpWithFees().deserialize(null)
      expect(deserialized.declared).to.be.undefined
      expect(deserialized.helpWithFeesNumber).to.be.undefined
    })

    it('should return a HelpWithFees instance with fields set when given an object with value', () => {
      const deserialized = new HelpWithFees().deserialize({ declared: YesNoOption.YES, helpWithFeesNumber: 'HWF01234' })
      expect(deserialized.declared).to.be.equal(YesNoOption.YES)
      expect(deserialized.helpWithFeesNumber).to.be.equal('HWF01234')
    })
  })

  context('validation', () => {
    const validator: Validator = new Validator()

    it('should reject HelpWithFees with undefined type', () => {
      const errors = validator.validateSync(new HelpWithFees(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept HelpWithFees with recognised values for YES', () => {
      const errors = validator.validateSync(new HelpWithFees(YesNoOption.YES, 'HWF01234'))
      expect(errors).to.be.empty
    })

    it('should accept HelpWithFees with recognised values for NO', () => {
      const errors = validator.validateSync(new HelpWithFees(YesNoOption.NO))
      expect(errors).to.be.empty
    })
  })
})
