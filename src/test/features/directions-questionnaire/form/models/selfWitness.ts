/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('SelfWitness', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const selfWitness: SelfWitness = new SelfWitness()
      expect(selfWitness.selfWitness).to.be.undefined
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
      const errors = validator.validateSync(new SelfWitness(true))
      expect(errors).to.be.empty
    })
  })

  describe('isCompleted', () => {
    it('Should be marked completed when an option is selected', () => {
      const selfWitness: SelfWitness = new SelfWitness(false)
      expect(selfWitness.isCompleted()).to.be.true
    })

    it('Should be marked not complete when no option is selected', () => {
      const selfWitness: SelfWitness = new SelfWitness(undefined)
      expect(selfWitness.isCompleted()).to.be.false
    })
  })
})
