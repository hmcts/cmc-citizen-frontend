import { expect } from 'chai'
import { Employment, ValidationErrors } from 'response/form/models/statement-of-means/employment'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('Employment', () => {

  describe('deserialize', () => {

    it('should return empty Employment for undefined given as input', () => {
      const actual = new Employment().deserialize(undefined)

      expect(actual).to.be.instanceof(Employment)
      expect(actual.declared).to.be.eq(undefined)
      expect(actual.selfEmployed).to.be.eq(undefined)
      expect(actual.employed).to.be.eq(undefined)
    })

    it('should return Employment with populated only isCurrentlyEmployed', () => {
      const actual = new Employment().deserialize({ declared: false })

      expect(actual.declared).to.be.eq(false)
      expect(actual.selfEmployed).to.be.eq(undefined)
      expect(actual.employed).to.be.eq(undefined)
    })

    it('should return fully populated Employment', () => {
      const actual = new Employment().deserialize(
        { declared: true, selfEmployed: false, employed: true }
      )

      expect(actual.declared).to.be.eq(true)
      expect(actual.selfEmployed).to.be.eq(false)
      expect(actual.employed).to.be.eq(true)
    })

    it('should NOT populate selfEmployed and employed when declared = false', () => {
      const actual = new Employment().deserialize(
        { declared: false, selfEmployed: true, employed: true }
      )

      expect(actual.declared).to.be.eq(false)
      expect(actual.selfEmployed).to.be.eq(undefined)
      expect(actual.employed).to.be.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given as input', () => {
      expect(Employment.fromObject(undefined)).to.be.eq(undefined)
    })

    it('should return Employment with populated only declared', () => {
      const actual = Employment.fromObject({ declared: false })

      expect(actual.declared).to.be.eq(false)
      expect(actual.selfEmployed).to.be.eq(undefined)
      expect(actual.employed).to.be.eq(undefined)
    })

    it('should return fully populated Employment', () => {
      const actual = Employment.fromObject(
        { declared: true, selfEmployed: false, employed: true }
      )

      expect(actual.declared).to.be.eq(true)
      expect(actual.selfEmployed).to.be.eq(false)
      expect(actual.employed).to.be.eq(true)
    })

    it('should NOT populate selfEmployed and employed when declared = false', () => {
      const actual = Employment.fromObject(
        { declared: false, selfEmployed: true, employed: true }
      )

      expect(actual.declared).to.be.eq(false)
      expect(actual.selfEmployed).to.be.eq(undefined)
      expect(actual.employed).to.be.eq(undefined)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('declared', () => {

      context('when declared is undefined', () => {

        it('should reject', () => {
          const errors = validator.validateSync(new Employment())

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
        })

      })

      context('when declared is', () => {

        context('true', () => {

          context('should reject when', () => {

            it('no other field is given', () => {
              const errors = validator.validateSync(new Employment(true))

              expect(errors.length).to.equal(1)
              expectValidationError(errors, ValidationErrors.SELECT_AT_LEAST_ONE_OPTION)
            })

            it('both are false', () => {
              const errors = validator.validateSync(Employment.fromObject({
                declared: true, selfEmployed: false, employed: false
              }))

              expect(errors.length).to.equal(1)
              expectValidationError(errors, ValidationErrors.SELECT_AT_LEAST_ONE_OPTION)
            })

          })

          context('should accept when', () => {

            it('all field set true', () => {
              const errors = validator.validateSync(new Employment(true, true, true))

              expect(errors.length).to.equal(0)
            })

            it('employed = true and selfEmployed = false', () => {
              const errors = validator.validateSync(new Employment(true, true, false))

              expect(errors.length).to.equal(0)
            })

            it('employed = false and selfEmployed = true', () => {
              const errors = validator.validateSync(new Employment(true, false, true))

              expect(errors.length).to.equal(0)
            })
          })
        })

        context('declared = false', () => {

          it('should not validate other fields', () => {
            const errors = validator.validateSync(new Employment(false, false, true))

            expect(errors.length).to.equal(0)
          })
        })
      })
    })
  })
})
