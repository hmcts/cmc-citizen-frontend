/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { WhyExpertIsNeeded, ValidationErrors } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

describe('WhyExpertIsNeeded', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when null', () => {
      const errors = validator.validateSync(new WhyExpertIsNeeded(null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject with no expert reason provided', () => {
      const errors = validator.validateSync(new WhyExpertIsNeeded())

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should accept when reason is provided', () => {
      const errors = validator.validateSync(new WhyExpertIsNeeded('Building needs inspecting'))

      expect(errors).to.be.empty
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new WhyExpertIsNeeded().deserialize(undefined)).to.deep.equal(new WhyExpertIsNeeded())
    })

    it('should deserialize expert evidence to return instance of expert evidence', () => {
      const whyExpertIsNeeded: WhyExpertIsNeeded = new WhyExpertIsNeeded('Building needs inspecting')

      expect(whyExpertIsNeeded.deserialize(whyExpertIsNeeded)).to.be.instanceOf(WhyExpertIsNeeded)
    })
  })

  describe('from object', () => {
    it('undefined when undefined provided', () => {
      const model = WhyExpertIsNeeded.fromObject(undefined)

      expect(model).to.be.undefined
    })

    it('empty object when unknown value provided', () => {
      const model = WhyExpertIsNeeded.fromObject({ explanation: undefined })

      expect(model.explanation).to.be.undefined
    })

    it('should return instance of whyExpertIsNeeded when passed WhyExpertIsNeeded object', () => {
      const explanation: string = 'Building needs inspecting'

      expect(WhyExpertIsNeeded.fromObject({ explanation })).to.be.instanceOf(WhyExpertIsNeeded)
    })
  })

  describe('isCompleted', () => {
    it('should be marked not completed when no option is present', () => {
      const expertEvidence: WhyExpertIsNeeded = new WhyExpertIsNeeded(undefined)

      expect(expertEvidence.isCompleted()).to.be.false
    })

    it('should be marked complete when explanation is given', () => {
      const expertEvidence: WhyExpertIsNeeded = new WhyExpertIsNeeded('Building needs inspecting')

      expect(expertEvidence.isCompleted()).to.be.true
    })
  })
})
