import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { Education, ValidationErrors } from 'response/form/models/statement-of-means/education'
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
        const errors = validator.validateSync(new Education(0, 1))

        expect(errors.length).to.equal(0)
      })

      it('positive number given', () => {
        const errors = validator.validateSync(new Education(10, 11))

        expect(errors.length).to.equal(0)
      })

      it('number is equal maxValue given', () => {
        const errors = validator.validateSync(new Education(2, 2))

        expect(errors.length).to.equal(0)
      })
    })

    describe('invalid when', () => {

      it('empty string given', () => {
        const errors = validator.validateSync(new Education('' as any))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
      })

      it('blank string given', () => {
        const errors = validator.validateSync(new Education('    ' as any))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
      })

      it('string given', () => {
        const errors = validator.validateSync(new Education('this is invalid value!' as any))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
      })

      it('decimal number given', () => {
        const errors = validator.validateSync(new Education(1.1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
      })

      it('negative number given', () => {
        const errors = validator.validateSync(new Education(-1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED)
      })

      it('negative decimal number given', () => {
        const errors = validator.validateSync(new Education(-1.1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
      })

      it('valid value but is greater than maxValue', () => {
        const errors = validator.validateSync(new Education(2, 1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.INVALID_NUMBER_OF_CHILDREN)
      })
    })
  })
})
