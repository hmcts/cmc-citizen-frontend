import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../../app/forms/models/validationUtils'
import { Dependants, ValidationErrors } from 'response/form/models/statement-of-means/dependants'

describe('Dependants', () => {

  describe('deserialize', () => {

    it('should return empty Dependants for undefined given as input', () => {
      const actual = new Dependants().deserialize(undefined)

      expect(actual).to.be.instanceof(Dependants)
      expect(actual.hasAnyChildren).to.be.eq(undefined)
      expect(actual.under11).to.be.eq(undefined)
      expect(actual.between11and15).to.be.eq(undefined)
      expect(actual.between16and19).to.be.eq(undefined)
    })

    it('should return Dependants with populated only hasAnyChildren', () => {
      const actual = new Dependants().deserialize({ hasAnyChildren: false })

      expect(actual.hasAnyChildren).to.be.eq(false)
      expect(actual.under11).to.be.eq(undefined)
      expect(actual.between11and15).to.be.eq(undefined)
      expect(actual.between16and19).to.be.eq(undefined)
    })

    it('should return fully populated Dependants', () => {
      const actual = new Dependants().deserialize(
        { hasAnyChildren: true, under11: 1, between11and15: 2, between16and19: 3 }
      )

      expect(actual.hasAnyChildren).to.be.eq(true)
      expect(actual.under11).to.be.eq(1)
      expect(actual.between11and15).to.be.eq(2)
      expect(actual.between16and19).to.be.eq(3)
    })

    it('should NOT populate other fields when hasAnyChildren = false', () => {
      const actual = new Dependants().deserialize(
        { hasAnyChildren: false, under11: 1, between11and15: 2, between16and19: 3 }
      )

      expect(actual.hasAnyChildren).to.be.eq(false)
      expect(actual.under11).to.be.eq(undefined)
      expect(actual.between11and15).to.be.eq(undefined)
      expect(actual.between16and19).to.be.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return empty Dependants for undefined given as input', () => {
      const actual = Dependants.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return Dependants with populated only hasAnyChildren', () => {
      const actual = Dependants.fromObject({ hasAnyChildren: false })

      expect(actual.hasAnyChildren).to.be.eq(false)
      expect(actual.under11).to.be.eq(undefined)
      expect(actual.between11and15).to.be.eq(undefined)
      expect(actual.between16and19).to.be.eq(undefined)
    })

    it('should return fully populated Dependants', () => {
      const actual = Dependants.fromObject(
        { hasAnyChildren: true, under11: '1', between11and15: '2', between16and19: '3' }
      )

      expect(actual.hasAnyChildren).to.be.eq(true)
      expect(actual.under11).to.be.eq(1)
      expect(actual.between11and15).to.be.eq(2)
      expect(actual.between16and19).to.be.eq(3)
    })

    it('should NOT populate other fields when hasAnyChildren = false', () => {
      const actual = Dependants.fromObject(
        { hasAnyChildren: false, under11: '1', between11and15: '2', between16and19: '3' }
      )

      expect(actual.hasAnyChildren).to.be.eq(false)
      expect(actual.under11).to.be.eq(undefined)
      expect(actual.between11and15).to.be.eq(undefined)
      expect(actual.between16and19).to.be.eq(undefined)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when hasAnyChildren is', () => {

      context('undefined', () => {

        it('should reject', () => {
          const errors = validator.validateSync(new Dependants())

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.HAS_ANY_CHILDREN_NOT_SELECTED)
        })
      })

      context('true', () => {

        context('should reject when', () => {

          it('one of other field is not given', () => {
            const errors = validator.validateSync(new Dependants(true, 10, 10, undefined))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, ValidationErrors.BETWEEN_16_AND_19_REQUIRED)
          })

          it('all are not given', () => {
            const errors = validator.validateSync(new Dependants(true, undefined, undefined, undefined))

            expect(errors.length).to.equal(3)
            expectValidationError(errors, ValidationErrors.UNDER_11_REQUIRED)
            expectValidationError(errors, ValidationErrors.BETWEEN_11_AND_15_REQUIRED)
            expectValidationError(errors, ValidationErrors.BETWEEN_16_AND_19_REQUIRED)
          })

          it('one of other fields has < 0 given', () => {
            const errors = validator.validateSync(new Dependants(true, -1, 2, 0))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, ValidationErrors.INVALID_NUMBER_OF_CHILDREN)
          })

          it('one of other fields has not integer given', () => {
            const errors = validator.validateSync(new Dependants(true, 0, 1.5, 0))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, ValidationErrors.INVALID_NUMBER_OF_CHILDREN)
          })
        })

        context('should accept when', () => {

          it('all field set 0', () => {
            const errors = validator.validateSync(new Dependants(true, 0, 0, 0))

            expect(errors.length).to.equal(0)
          })

          it('positive number', () => {
            const errors = validator.validateSync(new Dependants(true, 1, 1, 1))

            expect(errors.length).to.equal(0)
          })
        })
      })

      context('isCurrentlyEmployed = false', () => {

        it('should not validate other fields', () => {
          const errors = validator.validateSync(new Dependants(false, -10, -10, -10))

          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
