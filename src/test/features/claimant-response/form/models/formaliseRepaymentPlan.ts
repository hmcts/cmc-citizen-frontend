import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('FormaliseRepaymentPlan', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new FormaliseRepaymentPlan(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.SELECT_AN_OPTION)
    })

    it('should reject with invalid value', () => {
      const errors = validator.validateSync(new FormaliseRepaymentPlan(new FormaliseRepaymentPlanOption('invalid', 'value')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.SELECT_AN_OPTION)
    })

    it('should accept formaliseRepaymentPlan with recognised type', () => {
      FormaliseRepaymentPlanOption.all().forEach(option => {
        const errors = validator.validateSync(option)

        expect(errors.length).to.equal(0)
      })
    })
  })
  describe('fromObject', () => {

    it('should return undefined when undefined provided as object parameter', () => {
      expect(FormaliseRepaymentPlan.fromObject(undefined)).to.deep.equal(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(FormaliseRepaymentPlan.fromObject()).to.deep.equal(undefined)
    })

    it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
      expect(FormaliseRepaymentPlan.fromObject({})).to.deep.equal(new FormaliseRepaymentPlan(
        undefined
      ))
    })

    it('should return a new instance with defaults when amount and schedule are invalid', () => {
      expect(FormaliseRepaymentPlan.fromObject({ 'option': 'INVALID' })).to.deep.equal(new FormaliseRepaymentPlan(
        undefined
      ))
    })

    it('should return a new instance initialised with set field from object parameter provided', () => {
      expect(FormaliseRepaymentPlan.fromObject({ option: FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT.value })).to.deep.equal(
        new FormaliseRepaymentPlan(
          FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT
        )
      )
    })
  })
  describe('deserialize', () => {

    it('should return an FormaliseRepaymentPlan instance', () => {
      const deserialized = new FormaliseRepaymentPlan().deserialize({})
      expect(deserialized).to.be.instanceof(FormaliseRepaymentPlan)
    })

    it('should return a FormaliseRepaymentPlan instance with fields set to default values when given "undefined"', () => {
      const deserialized = new FormaliseRepaymentPlan().deserialize(undefined)
      expect(deserialized.option).to.be.equal(undefined)
    })

    it('should return a FormaliseRepaymentPlan instance with fields set to default values when given "null"', () => {
      const deserialized = new FormaliseRepaymentPlan().deserialize(null)
      expect(deserialized.option).to.be.equal(undefined)
    })

    it('should return a FormaliseRepaymentPlan instance with fields set when given an object with value', () => {
      const deserialized = new FormaliseRepaymentPlan().deserialize(
        { option: FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT })
      expect(deserialized).to.be.deep.equal({ option: FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT })
    })
  })
})
