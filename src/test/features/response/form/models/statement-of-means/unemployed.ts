import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError, generateString } from '../../../../../app/forms/models/validationUtils'
import { Unemployed } from 'response/form/models/statement-of-means/unemployed'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import {
  UnemploymentDetails,
  ValidationConstraints as UDValidationConstraints,
  ValidationErrors as UDValidationErrors
} from 'response/form/models/statement-of-means/unemploymentDetails'
import { OtherDetails, ValidationErrors } from 'response/form/models/statement-of-means/otherDetails'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('Unemployed', () => {

  describe('deserialize', () => {

    it('should return empty Unemployed for undefined given as input', () => {
      const actual = new Unemployed().deserialize(undefined)

      expect(actual).to.be.instanceof(Unemployed)
      expect(actual.option).to.be.eq(undefined)
      expect(actual.unemploymentDetails).to.be.eq(undefined)
      expect(actual.otherDetails).to.be.eq(undefined)
    })

    context('should return fully populated Unemployed for option', () => {

      it('UNEMPLOYED', () => {
        const actual = new Unemployed().deserialize(
          { option: UnemploymentType.UNEMPLOYED, unemploymentDetails: { years: 1, months: 2 } }
        )

        expect(actual.option).to.equal(UnemploymentType.UNEMPLOYED)
        expect(actual.unemploymentDetails).to.be.instanceof(UnemploymentDetails)
        expect(actual.unemploymentDetails.years).to.be.eq(1)
        expect(actual.unemploymentDetails.months).to.be.eq(2)
        expect(actual.otherDetails).to.be.eq(undefined)
      })

      it('OTHER', () => {
        const actual = new Unemployed().deserialize(
          { option: UnemploymentType.OTHER, otherDetails: { details: 'my story' } }
        )

        expect(actual.option).to.equal(UnemploymentType.OTHER)
        expect(actual.unemploymentDetails).to.be.eq(undefined)
        expect(actual.otherDetails).to.be.instanceof(OtherDetails)
        expect(actual.otherDetails.details).to.be.eq('my story')

      })

      it('RETIRED', () => {
        const actual = new Unemployed().deserialize({ option: UnemploymentType.RETIRED })

        expect(actual.option).to.equal(UnemploymentType.RETIRED)
        expect(actual.unemploymentDetails).to.be.eq(undefined)
        expect(actual.otherDetails).to.be.eq(undefined)
      })
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given as input', () => {
      const actual = Unemployed.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    context('should return fully populated Unemployed for option', () => {

      it('UNEMPLOYED', () => {
        const actual = Unemployed.fromObject(
          { option: UnemploymentType.UNEMPLOYED.value, unemploymentDetails: { years: '1', months: '2' } }
        )

        expect(actual.option).to.equal(UnemploymentType.UNEMPLOYED)
        expect(actual.unemploymentDetails).to.be.instanceof(UnemploymentDetails)
        expect(actual.unemploymentDetails.years).to.be.eq(1)
        expect(actual.unemploymentDetails.months).to.be.eq(2)
        expect(actual.otherDetails).to.be.eq(undefined)
      })

      it('OTHER', () => {
        const actual = Unemployed.fromObject(
          { option: UnemploymentType.OTHER.value, otherDetails: { details: 'my story' } }
        )

        expect(actual.option).to.equal(UnemploymentType.OTHER)
        expect(actual.unemploymentDetails).to.be.eq(undefined)
        expect(actual.otherDetails).to.be.instanceof(OtherDetails)
        expect(actual.otherDetails.details).to.be.eq('my story')

      })

      it('RETIRED', () => {
        const actual = Unemployed.fromObject({ option: UnemploymentType.RETIRED.value })

        expect(actual.option).to.equal(UnemploymentType.RETIRED)
        expect(actual.unemploymentDetails).to.be.eq(undefined)
        expect(actual.otherDetails).to.be.eq(undefined)
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    describe('should accept when', () => {

      it('option UNEMPLOYED and valid details', () => {
        const errors = validator.validateSync(
          new Unemployed(UnemploymentType.UNEMPLOYED, new UnemploymentDetails(1, 1))
        )

        expect(errors.length).to.equal(0)
      })

      it('option RETIRED and no details', () => {
        const errors = validator.validateSync(new Unemployed(UnemploymentType.RETIRED))

        expect(errors.length).to.equal(0)
      })

      it('option OTHER and valid details', () => {
        const errors = validator.validateSync(
          new Unemployed(UnemploymentType.OTHER, undefined, new OtherDetails('my story'))
        )

        expect(errors.length).to.equal(0)
      })

      it('option RETIRED and all other details (valid)', () => {
        const errors = validator.validateSync(
          new Unemployed(UnemploymentType.RETIRED, new UnemploymentDetails(1, 1), new OtherDetails('my story'))
        )

        expect(errors.length).to.equal(0)
      })

      it('option RETIRED and all other details (invalid)', () => {
        const errors = validator.validateSync(
          new Unemployed(UnemploymentType.RETIRED, new UnemploymentDetails(-1, -1), new OtherDetails(''))
        )

        expect(errors.length).to.equal(0)
      })
    })

    describe('should reject when', () => {

      context('invalid unemployment details', () => {

        it('invalid years in unemployment details', () => {
          const errors = validator.validateSync(
            new Unemployed(UnemploymentType.UNEMPLOYED, new UnemploymentDetails(-1, 0))
          )

          expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED)
        })

        it('invalid month in unemployment details', () => {
          const errors = validator.validateSync(
            new Unemployed(UnemploymentType.UNEMPLOYED, new UnemploymentDetails(1, -1))
          )

          expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED)
        })

        it('too many months in unemployment details', () => {
          const errors = validator.validateSync(
            new Unemployed(
              UnemploymentType.UNEMPLOYED,
              new UnemploymentDetails(1, UDValidationConstraints.MAX_NUMBER_OF_MONTHS + 1)
            )
          )

          expect(errors.length).to.equal(1)
          expectValidationError(
            errors, UDValidationErrors.TOO_MANY.replace('$constraint1', UDValidationConstraints.MAX_NUMBER_OF_MONTHS)
          )
        })

        it('too many years in unemployment details', () => {
          const errors = validator.validateSync(
            new Unemployed(
              UnemploymentType.UNEMPLOYED,
              new UnemploymentDetails(UDValidationConstraints.MAX_NUMBER_OF_YEARS + 1, 0)
            )
          )

          expect(errors.length).to.equal(1)
          expectValidationError(
            errors, UDValidationErrors.TOO_MANY.replace('$constraint1', UDValidationConstraints.MAX_NUMBER_OF_YEARS)
          )
        })
      })

      context('invalid other details', () => {

        it('empty details', () => {
          const errors = validator.validateSync(
            new Unemployed(UnemploymentType.OTHER, undefined, new OtherDetails(''))
          )

          expectValidationError(errors, ValidationErrors.DETAILS_REQUIRED)
        })

        it('too long details', () => {
          const errors = validator.validateSync(
            new Unemployed(
              UnemploymentType.OTHER,
              undefined,
              new OtherDetails(generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1))
            )
          )

          expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
        })
      })
    })
  })
})
