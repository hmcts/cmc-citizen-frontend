/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { DeterminationWithoutHearingQuestions, ValidationErrors } from 'directions-questionnaire/forms/models/determinationWithoutHearingQuestions'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

describe('determinationWithoutHearingQuestions', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when null', () => {
      const errors = validator.validateSync(new DeterminationWithoutHearingQuestions(null, null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject with no determination questions option', () => {
      const errors = validator.validateSync(new DeterminationWithoutHearingQuestions())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject determination questions with no option and no determination details', () => {
      const errors = validator.validateSync(new DeterminationWithoutHearingQuestions(YesNoOption.NO))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should accept determination questions with no option and what to expect reason', () => {
      const errors = validator.validateSync(new DeterminationWithoutHearingQuestions(YesNoOption.NO, 'determination details'))

      expect(errors).to.be.empty
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new DeterminationWithoutHearingQuestions().deserialize(undefined)).to.deep.equal(new DeterminationWithoutHearingQuestions())
    })

    it('should deserialize determination questions to return instance of determination questions', () => {
      const determinationWithoutHearingQuestions: DeterminationWithoutHearingQuestions = new DeterminationWithoutHearingQuestions(YesNoOption.NO, 'determination details')

      expect(determinationWithoutHearingQuestions.deserialize(determinationWithoutHearingQuestions)).to.be.instanceOf(DeterminationWithoutHearingQuestions)
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = DeterminationWithoutHearingQuestions.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('empty object when unknown value provided', () => {
      const model = DeterminationWithoutHearingQuestions.fromObject({ otherWitnesses: 'I do not know this value!' })

      expect(model.determinationWithoutHearingQuestions).to.be.eq(undefined)
    })

    it(`valid object when values provided`, () => {
      const model = DeterminationWithoutHearingQuestions.fromObject({ determinationWithoutHearingQuestions: 'no' })
      expect(model.determinationWithoutHearingQuestions).to.be.eq(YesNoOption.NO)
    })
  })

  describe('isCompleted', () => {
    it('should be marked not completed when no option is present', () => {
      const determinationWithoutHearingQuestions: DeterminationWithoutHearingQuestions = new DeterminationWithoutHearingQuestions(undefined)

      expect(determinationWithoutHearingQuestions.isCompleted()).to.be.false
    })

    it('should be marked complete when yes option is selected', () => {
      const determinationWithoutHearingQuestions: DeterminationWithoutHearingQuestions = new DeterminationWithoutHearingQuestions(YesNoOption.YES)

      expect(determinationWithoutHearingQuestions.isCompleted()).to.be.true
    })

    it('Should be marked not complete when the no option is selected and nothing is entered', () => {
      const determinationWithoutHearingQuestions: DeterminationWithoutHearingQuestions = new DeterminationWithoutHearingQuestions(YesNoOption.NO)

      expect(determinationWithoutHearingQuestions.isCompleted()).to.be.false
    })

    it('Should be marked complete when the no option is selected and determination detail is present', () => {
      const determinationWithoutHearingQuestions: DeterminationWithoutHearingQuestions = new DeterminationWithoutHearingQuestions(YesNoOption.NO, 'determination')
      expect(determinationWithoutHearingQuestions.isCompleted()).to.be.true
    })

  })
})
