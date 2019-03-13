/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

describe('OtherWitnesses', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const otherWitnesses: OtherWitnesses = new OtherWitnesses()
      expect(otherWitnesses.otherWitnesses).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject other witness with null type', () => {
      const errors = validator.validateSync(new OtherWitnesses(null, null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject other witness with no other witnesses option ', () => {
      const errors = validator.validateSync(new OtherWitnesses())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject other witnesses with yes option and no how many present', () => {
      const errors = validator.validateSync(new OtherWitnesses(YesNoOption.YES))
      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
    })

    it('should accept other witness with option and how many present' , () => {
      const errors = validator.validateSync(new OtherWitnesses(YesNoOption.YES, 1))
      expect(errors).to.be.empty
    })
  })

  describe('isCompleted', () => {
    it('Should be marked not completed when no option is present', () => {
      const otherWitnesses: OtherWitnesses = new OtherWitnesses(undefined)
      expect(otherWitnesses.isCompleted()).to.be.false
    })

    it('Should be marked complete when the no option is selected', () => {
      const otherWitnesses: OtherWitnesses = new OtherWitnesses(YesNoOption.NO)
      expect(otherWitnesses.isCompleted()).to.be.true
    })

    it('Should be marked not complete when the yes option is selected and no how many present', () => {
      const otherWitnesses: OtherWitnesses = new OtherWitnesses(YesNoOption.YES)
      expect(otherWitnesses.isCompleted()).to.be.false
    })

    it('Should be marked complete when the yes option is selected and how many is present', () => {
      const otherWitnesses: OtherWitnesses = new OtherWitnesses(YesNoOption.YES, 1)
      expect(otherWitnesses.isCompleted()).to.be.true
    })
  })
})
