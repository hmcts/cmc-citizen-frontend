import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../../app/forms/models/validationUtils'
import { Education } from 'response/form/models/statement-of-means/education'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('Education', () => {

  describe('deserialize', () => {

    it('should return empty Education for undefined given as input', () => {
      const actual = new Education().deserialize(undefined)

      expect(actual).to.be.instanceof(Education)
      expect(actual.value).to.be.eq(undefined)
    })

    it('should return populated Education', () => {
      const actual = new Education().deserialize({ value: 1 })

      expect(actual.value).to.be.eq(1)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given as input', () => {
      const actual = Education.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return populated Education', () => {
      const actual = Education.fromObject({ value: '2' })

      expect(actual.value).to.be.eq(2)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('valid when', () => {

      it('0 given', () => {
        const errors = validator.validateSync(new Education(0))

        expect(errors.length).to.equal(0)
      })

      it('positive number given', () => {
        const errors = validator.validateSync(new Education(10))

        expect(errors.length).to.equal(0)
      })
    })

    describe('invalid when', () => {

      it('empty string given', () => {
        const errors = validator.validateSync(new Education('' as any))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
      })

      it('blank string given', () => {
        const errors = validator.validateSync(new Education('    ' as any))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
      })

      it('string given', () => {
        const errors = validator.validateSync(new Education('this is invalid value!' as any))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
      })

      it('decimal number given', () => {
        const errors = validator.validateSync(new Education(1.1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
      })

      it('negative number given', () => {
        const errors = validator.validateSync(new Education(-1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
      })

      it('negative decimal number given', () => {
        const errors = validator.validateSync(new Education(-1.1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
      })
    })
  })
})
