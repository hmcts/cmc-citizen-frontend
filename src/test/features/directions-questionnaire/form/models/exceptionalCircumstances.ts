/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import {
  ExceptionalCircumstances,
  ValidationErrors
} from 'directions-questionnaire/forms/models/exceptionalCircumstances'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

describe('ExceptionalCircumstances', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances()
      expect(exceptionalCircumstances.exceptionalCircumstances).to.be.undefined
      expect(exceptionalCircumstances.reason).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when null', () => {
      const errors = validator.validateSync(new ExceptionalCircumstances(null, null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject with no exceptional circumstances option ', () => {
      const errors = validator.validateSync(new ExceptionalCircumstances())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject exceptional circumstances with yes option and no reason', () => {
      const errors = validator.validateSync(new ExceptionalCircumstances(YesNoOption.YES))
      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should accept other witness with option and reason present', () => {
      const errors = validator.validateSync(new ExceptionalCircumstances(YesNoOption.YES, 'reason'))
      expect(errors).to.be.empty
    })
  })

  describe('isCompleted', () => {
    it('Should be marked not completed when no option is present', () => {
      const exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances(undefined)
      expect(exceptionalCircumstances.isDefendantCompleted()).to.be.false
    })

    it('Should be marked complete when the no option is selected', () => {
      const exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances(YesNoOption.NO)
      expect(exceptionalCircumstances.isDefendantCompleted()).to.be.true
    })

    it('Should be marked not complete when the yes option is selected and no reason is entered', () => {
      const exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances(YesNoOption.YES)
      expect(exceptionalCircumstances.isDefendantCompleted()).to.be.false
    })

    it('Should be marked complete when the yes option is selected and reason is present', () => {
      const exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances(YesNoOption.YES, 'reason')
      expect(exceptionalCircumstances.isDefendantCompleted()).to.be.true
    })
  })
})
