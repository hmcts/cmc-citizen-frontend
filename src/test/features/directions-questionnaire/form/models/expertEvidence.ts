/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { ExpertEvidence, ValidationErrors } from 'directions-questionnaire/forms/models/expertEvidence'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { ExceptionalCircumstances } from 'directions-questionnaire/forms/models/exceptionalCircumstances'

describe('ExpertEvidence', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when null', () => {
      const errors = validator.validateSync(new ExpertEvidence(null, null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject with no expert evidence option', () => {
      const errors = validator.validateSync(new ExpertEvidence())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject expert evidence with yes option and no whatToExamine', () => {
      const errors = validator.validateSync(new ExpertEvidence(YesNoOption.YES))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should accept expert evidence with option and what to expect reason', () => {
      const errors = validator.validateSync(new ExpertEvidence(YesNoOption.YES, 'bank statements'))

      expect(errors).to.be.empty
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new ExpertEvidence().deserialize(undefined)).to.deep.equal(new ExpertEvidence())
    })

    it('should deserialize expert evidence to return instance of expert evidence', () => {
      const expertEvidence: ExpertEvidence = new ExpertEvidence(YesNoOption.YES, 'bank statements')

      expect(expertEvidence.deserialize(expertEvidence)).to.be.instanceOf(ExpertEvidence)
    })
  })

  describe('from object', () => {
    it('should return instance of expert evidence when passed ExpertEvidence object - Yes', () => {
      const yes: YesNoOption = YesNoOption.YES
      const whatToExamine: string = 'bank statements'

      expect(ExpertEvidence.fromObject({ yes, whatToExamine })).to.be.instanceOf(ExpertEvidence)
    })

    it('should return instance of expert evidence when passed ExpertEvidence object - No', () => {
      const no: YesNoOption = YesNoOption.NO

      expect(ExpertEvidence.fromObject({ no })).to.be.instanceOf(ExpertEvidence)
    })
  })

  describe('isCompleted', () => {
    it('should be marked not completed when no option is present', () => {
      const expertEvidence: ExpertEvidence = new ExpertEvidence(undefined)

      expect(expertEvidence.isCompleted()).to.be.false
    })

    it('should be marked complete when no option is selected', () => {
      const expertEvidence: ExpertEvidence = new ExpertEvidence(YesNoOption.NO)

      expect(expertEvidence.isCompleted()).to.be.true
    })

    it('Should be marked not complete when the yes option is selected and no reason is entered', () => {
      const expertEvidence: ExpertEvidence = new ExpertEvidence(YesNoOption.YES)

      expect(expertEvidence.isCompleted()).to.be.false
    })

    it('Should be marked complete when the yes option is selected and what to examine is present', () => {
      const exceptionalCircumstances: ExceptionalCircumstances =
        new ExceptionalCircumstances(YesNoOption.YES, 'bank statements')

      expect(exceptionalCircumstances.isDefendantCompleted()).to.be.true
    })
  })
})
