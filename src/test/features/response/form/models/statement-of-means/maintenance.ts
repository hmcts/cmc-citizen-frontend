import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../../app/forms/models/validationUtils'
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('Maintenance', () => {

  describe('deserialize', () => {

    it('should return empty Maintenance for undefined given as input', () => {
      const actual = new Maintenance().deserialize(undefined)

      expect(actual).to.be.instanceof(Maintenance)
      expect(actual.option).to.be.eq(undefined)
      expect(actual.value).to.be.eq(undefined)
    })

    it('should return Maintenance with populated only hasAnyChildren', () => {
      const actual = new Maintenance().deserialize({ option: false })

      expect(actual.option).to.be.eq(false)
      expect(actual.value).to.be.eq(undefined)
    })

    it('should return fully populated Maintenance', () => {
      const actual = new Maintenance().deserialize(
        { option: true, value: 3 }
      )

      expect(actual.option).to.be.eq(true)
      expect(actual.value).to.be.eq(3)
    })

    it('should NOT populate other fields when option = false', () => {
      const actual = new Maintenance().deserialize(
        { option: false, value: 3 }
      )

      expect(actual.option).to.be.eq(false)
      expect(actual.value).to.be.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return empty Maintenance for undefined given as input', () => {
      const actual = Maintenance.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return Maintenance with populated only hasAnyChildren', () => {
      const actual = Maintenance.fromObject({ option: false })

      expect(actual.option).to.be.eq(false)
      expect(actual.value).to.be.eq(undefined)
    })

    it('should return fully populated Maintenance', () => {
      const actual = Maintenance.fromObject(
        { option: true, value: 2 }
      )

      expect(actual.option).to.be.eq(true)
      expect(actual.value).to.be.eq(2)
    })

    it('should NOT populate other fields when option = false', () => {
      const actual = Maintenance.fromObject(
        { option: false, value: 3 }
      )

      expect(actual.option).to.be.eq(false)
      expect(actual.value).to.be.eq(undefined)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when option is', () => {

      context('undefined', () => {

        it('should reject', () => {
          const errors = validator.validateSync(new Maintenance())

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
        })
      })

      context('true', () => {

        context('should reject when', () => {

          it('value is not given', () => {
            const errors = validator.validateSync(new Maintenance(true, undefined))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
          })

          it('value < 0 given', () => {
            const errors = validator.validateSync(new Maintenance(true, -1))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
          })

          it('value = 0 given', () => {
            const errors = validator.validateSync(new Maintenance(true, 0))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
          })

          it('value is not an integer', () => {
            const errors = validator.validateSync(new Maintenance(true, 1.5))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
          })
        })

        context('should accept when', () => {

          it('value > 0', () => {
            const errors = validator.validateSync(new Maintenance(true, 1))

            expect(errors.length).to.equal(0)
          })
        })
      })

      context('option = false', () => {

        it('should not validate other fields', () => {
          const errors = validator.validateSync(new Maintenance(false, -10.1))

          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
