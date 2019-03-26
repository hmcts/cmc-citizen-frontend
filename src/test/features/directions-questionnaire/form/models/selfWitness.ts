/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

describe('SelfWitness', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const selfWitness: SelfWitness = new SelfWitness()
      expect(selfWitness.option).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject self witness with null type', () => {
      const errors = validator.validateSync(new SelfWitness(null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject self witness with no self witness option ', () => {
      const errors = validator.validateSync(new SelfWitness())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept self witness with option present' , () => {
      const errors = validator.validateSync(new SelfWitness(YesNoOption.YES))
      expect(errors).to.be.empty
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = SelfWitness.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('empty object when unknown value provided', () => {
      const model = SelfWitness.fromObject({ option: 'I do not know this value!' })

      expect(model.option).to.be.eq(undefined)
    })

    it(`valid object when values provided`, () => {
      const model = SelfWitness.fromObject({ option: 'yes' })
      expect(model.option).to.be.eq(YesNoOption.YES)
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new SelfWitness().deserialize(undefined)).to.be.eql(new SelfWitness())
    })

    it('should return an instance from given object', () => {
      const actual: SelfWitness = new SelfWitness().deserialize({ option: 'yes' })

      expect(actual).to.be.eql(new SelfWitness(YesNoOption.YES))
    })

  })

  describe('isCompleted', () => {
    it('Should be marked completed when an option is selected', () => {
      const selfWitness: SelfWitness = new SelfWitness(YesNoOption.YES)
      expect(selfWitness.isCompleted()).to.be.true
    })

    it('Should be marked not complete when no option is selected', () => {
      const selfWitness: SelfWitness = new SelfWitness(undefined)
      expect(selfWitness.isCompleted()).to.be.false
    })
  })
})
