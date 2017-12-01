import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../../app/forms/models/validationUtils'
import { SupportedByYou } from 'response/form/models/statement-of-means/supportedByYou'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { NumberOfPeople, ValidationErrors } from 'response/form/models/statement-of-means/numberOfPeople'

describe('SupportedByYou', () => {

  describe('deserialize', () => {

    it('should return empty SupportedByYou for undefined given as input', () => {
      const actual = new SupportedByYou().deserialize(undefined)

      expect(actual).to.be.instanceof(SupportedByYou)
      expect(actual.doYouSupportAnyone).to.be.eq(undefined)
      expect(actual.numberOfPeople).to.be.eq(undefined)
    })

    it('should return SupportedByYou with populated only doYouSupportAnyone', () => {
      const actual = new SupportedByYou().deserialize({ doYouSupportAnyone: false })

      expect(actual.doYouSupportAnyone).to.be.eq(false)
      expect(actual.numberOfPeople).to.be.eq(undefined)
    })

    it('should return fully populated SupportedByYou', () => {
      const actual = new SupportedByYou().deserialize(
        { doYouSupportAnyone: true, numberOfPeople: { value: 1, details: 'my story' } }
      )

      expect(actual.doYouSupportAnyone).to.be.eq(true)
      expect(actual.numberOfPeople.value).to.be.eq(1)
      expect(actual.numberOfPeople.details).to.be.eq('my story')
    })

    it('should NOT populate other fields when doYouSupportAnyone = false', () => {
      const actual = new SupportedByYou().deserialize(
        { doYouSupportAnyone: false, numberOfPeople: { value: 1, details: 'my story' } }
      )

      expect(actual.doYouSupportAnyone).to.be.eq(false)
      expect(actual.numberOfPeople).to.be.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return empty SupportedByYou for undefined given as input', () => {
      const actual = SupportedByYou.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return SupportedByYou with populated only doYouSupportAnyone', () => {
      const actual = SupportedByYou.fromObject({ doYouSupportAnyone: false })

      expect(actual.doYouSupportAnyone).to.be.eq(false)
      expect(actual.numberOfPeople).to.be.eq(undefined)
    })

    it('should return fully populated SupportedByYou', () => {
      const actual = SupportedByYou.fromObject(
        { doYouSupportAnyone: true, numberOfPeople: { value: '1', details: 'my story' } }
      )

      expect(actual.doYouSupportAnyone).to.be.eq(true)
      expect(actual.numberOfPeople.value).to.be.eq(1)
      expect(actual.numberOfPeople.details).to.be.eq('my story')
    })

    it('should NOT populate other fields when doYouSupportAnyone = false', () => {
      const actual = SupportedByYou.fromObject(
        { doYouSupportAnyone: false, numberOfPeople: { value: '1', details: 'my story' } }
      )

      expect(actual.doYouSupportAnyone).to.be.eq(false)
      expect(actual.numberOfPeople).to.be.eq(undefined)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    context('when doYouSupportAnyone is', () => {

      context('undefined', () => {

        it('should reject', () => {
          const errors = validator.validateSync(new SupportedByYou())

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
        })
      })

      context('true', () => {

        context('should reject when', () => {

          it('all field left empty', () => {
            const errors = validator.validateSync(new SupportedByYou(true, new NumberOfPeople(undefined, '')))

            expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
            expectValidationError(errors, ValidationErrors.DETAILS_REQUIRED)
          })

          it('number of people < 0', () => {
            const errors = validator.validateSync(new SupportedByYou(true, new NumberOfPeople(-1, 'my story')))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
          })

          it('number of people = 0', () => {
            const errors = validator.validateSync(new SupportedByYou(true, new NumberOfPeople(0, 'my story')))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
          })

          it('number of people is not integer', () => {
            const errors = validator.validateSync(new SupportedByYou(true, new NumberOfPeople(1.4, 'my story')))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, GlobalValidationErrors.INTEGER_REQUIRED)
          })

          it('details empty', () => {
            const errors = validator.validateSync(new SupportedByYou(true, new NumberOfPeople(1, '')))

            expect(errors.length).to.equal(1)
            expectValidationError(errors, ValidationErrors.DETAILS_REQUIRED)
          })
        })

        it('should accept when all required fields are valid', () => {
          const errors = validator.validateSync(new SupportedByYou(true, new NumberOfPeople(10, 'my story')))

          expect(errors.length).to.equal(0)
        })
      })

      context('doYouSupportAnyone = false', () => {

        it('should accept when other fields empty', () => {
          const errors = validator.validateSync(new SupportedByYou(false, undefined))

          expect(errors.length).to.equal(0)
        })

        it('should accept when other fields populated', () => {
          const errors = validator.validateSync(new SupportedByYou(false, new NumberOfPeople(10, 'my story')))

          expect(errors.length).to.equal(0)
        })
      })

    })
  })
})
