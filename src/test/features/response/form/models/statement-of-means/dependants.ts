import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { Dependants, ValidationErrors } from 'response/form/models/statement-of-means/dependants'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'

describe('Dependants', () => {

  describe('deserialize', () => {

    it('should return empty Dependants for undefined given as input', () => {
      const actual = new Dependants().deserialize(undefined)

      expect(actual).to.be.instanceof(Dependants)
      expect(actual.declared).to.be.eq(undefined)
      expect(actual.numberOfChildren).to.be.eq(undefined)
    })

    it('should return Dependants with populated only declared', () => {
      const actual = new Dependants().deserialize({ declared: false })

      expect(actual.declared).to.be.eq(false)
      expect(actual.numberOfChildren).to.be.eq(undefined)
    })

    it('should return fully populated Dependants', () => {
      const actual = new Dependants().deserialize(
        { declared: true, numberOfChildren: { under11: 1, between11and15: 2, between16and19: 3 } }
      )

      expect(actual.declared).to.be.eq(true)
      expect(actual.numberOfChildren.under11).to.be.eq(1)
      expect(actual.numberOfChildren.between11and15).to.be.eq(2)
      expect(actual.numberOfChildren.between16and19).to.be.eq(3)
    })

    it('should NOT populate other fields when declared = false', () => {
      const actual = new Dependants().deserialize(
        { declared: false, numberOfChildren: { under11: 1, between11and15: 2, between16and19: 3 } }
      )

      expect(actual.declared).to.be.eq(false)
      expect(actual.numberOfChildren).to.be.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return empty Dependants for undefined given as input', () => {
      const actual = Dependants.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return Dependants with populated only declared', () => {
      const actual = Dependants.fromObject({ declared: false })

      expect(actual.declared).to.be.eq(false)
      expect(actual.numberOfChildren).to.be.eq(undefined)
    })

    it('should return fully populated Dependants', () => {
      const actual = Dependants.fromObject(
        { declared: true, numberOfChildren: { under11: '1', between11and15: '2', between16and19: '3' } }
      )

      expect(actual.declared).to.be.eq(true)
      expect(actual.numberOfChildren.under11).to.be.eq(1)
      expect(actual.numberOfChildren.between11and15).to.be.eq(2)
      expect(actual.numberOfChildren.between16and19).to.be.eq(3)
    })

    it('should NOT populate other fields when declared = false', () => {
      const actual = Dependants.fromObject(
        { declared: false, numberOfChildren: { under11: '1', between11and15: '2', between16and19: '3' } }
      )

      expect(actual.declared).to.be.eq(false)
      expect(actual.numberOfChildren).to.be.eq(undefined)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when declared is', () => {

      context('undefined', () => {

        it('should reject', () => {
          const errors = validator.validateSync(new Dependants())

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
        })
      })

      context('true', () => {

        context('should reject when', () => {

          it('all are not given', () => {
            const errors = validator.validateSync(
              new Dependants(true, new NumberOfChildren(undefined, undefined, undefined))
            )

            expect(errors.length).to.equal(1)
            expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE)
          })

          it('all field set 0', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(0, 0, 0)))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE)
          })

          it('under11 is < 0', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(-1, 2, 0)))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED)
          })

          it('between11and15 is < 0', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(1, -1, 0)))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED)
          })

          it('between16and19 is < 0', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(1, 1, -1)))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED)
          })

          it('under11 is decimal', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(1.1, 0, 0)))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
          })

          it('between11and15 is decimal', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(0, 1.5, 0)))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
          })

          it('between16and19 is decimal', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(0, 1, 1.2)))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
          })
        })

        context('should accept when', () => {

          it('one of other field is not given', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(10, 10, undefined)))

            expect(errors.length).to.equal(0)
          })

          it('positive number', () => {
            const errors = validator.validateSync(new Dependants(true, new NumberOfChildren(1, 1, 1)))

            expect(errors.length).to.equal(0)
          })
        })
      })

      context('isCurrentlyEmployed = false', () => {

        it('should not validate other fields', () => {
          const errors = validator.validateSync(new Dependants(false, new NumberOfChildren(-10, -10, -10)))

          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
