/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { ExpertRequired } from 'directions-questionnaire/forms/models/expertRequired'

describe('ExpertRequired', () => {
  context('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const expertRequired: ExpertRequired = new ExpertRequired()
      expect(expertRequired.option).to.be.undefined
    })
  })

  context('validation', () => {
    const validator: Validator = new Validator()

    it('should reject expert required with null type', () => {
      const errors = validator.validateSync(new ExpertRequired(null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject expert required with no expert required option ', () => {
      const errors = validator.validateSync(new ExpertRequired())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept expert required with option present', () => {
      const errors = validator.validateSync(new ExpertRequired(YesNoOption.YES))
      expect(errors).to.be.empty
    })
  })

  context('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = ExpertRequired.fromObject(undefined)

      expect(model).to.be.undefined
    })

    it('empty object when unknown value provided', () => {
      const model = ExpertRequired.fromObject({ option: 'I do not know this value!' })

      expect(model.option).to.be.undefined
    })

    it(`valid object when values provided`, () => {
      const model = ExpertRequired.fromObject({ option: 'yes' })
      expect(model.option).to.equal(YesNoOption.YES)
    })
  })

  context('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new ExpertRequired().deserialize(undefined)).to.deep.equal(new ExpertRequired())
    })

    it('should return an instance from given object', () => {
      const actual: ExpertRequired = new ExpertRequired().deserialize({ option: 'yes' })

      expect(actual).to.deep.equal(new ExpertRequired(YesNoOption.YES))
    })

  })

  context('isCompleted', () => {
    it('Should be marked completed when an option is selected', () => {
      const expertRequired: ExpertRequired = new ExpertRequired(YesNoOption.YES)
      expect(expertRequired.isCompleted()).to.be.true
    })

    it('Should be marked not complete when no option is selected', () => {
      const expertRequired: ExpertRequired = new ExpertRequired(undefined)
      expect(expertRequired.isCompleted()).to.be.false
    })
  })
})
