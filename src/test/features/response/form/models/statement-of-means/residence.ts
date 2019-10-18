/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'

import { Residence, ValidationErrors } from 'response/form/models/statement-of-means/residence'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { ValidationError, Validator } from '@hmcts/class-validator'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('Residence', () => {
  context('draft object deserialisation', () => {
    it('should return an instance with blank fields when given undefined', () => {
      const residence: Residence = new Residence().deserialize(undefined)
      expect(residence.type).to.be.undefined
      expect(residence.housingDetails).to.be.undefined
    })

    it('should return with given values when given an object', () => {
      const residence: Residence = new Residence().deserialize({
        type: ResidenceType.OTHER,
        housingDetails: 'Squat'
      })
      expect(residence.type.value).to.equal(ResidenceType.OTHER.value)
      expect(residence.housingDetails).to.equal('Squat')
    })
  })

  context('form object deserialisation', () => {
    it('should return undefined if given undefined', () => {
      expect(Residence.fromObject(undefined)).to.be.undefined
    })

    it('should return instance with fields set to undefined if given empty object', () => {
      const residence: Residence = Residence.fromObject({ })
      expect(residence.type).to.be.undefined
      expect(residence.housingDetails).to.be.undefined
    })

    it('should return Residence instance build based on given form input', () => {
      const residence: Residence = Residence.fromObject({
        type: 'OTHER',
        housingDetails: 'Squat'
      })
      expect(residence.type.value).to.equal(ResidenceType.OTHER.value)
      expect(residence.housingDetails).to.equal('Squat')
    })

    it('should set housingDetails to undefined if type different to OTHER is provided', () => {
      const residence: Residence = Residence.fromObject({
        type: 'OWN_HOME',
        otherTypeDetails: 'Some details'
      })
      expect(residence.housingDetails).to.be.undefined
    })
  })

  context('validation', () => {
    const validator: Validator = new Validator()

    it('should have no validation errors when the object is valid', () => {
      const errors: ValidationError[] = validator.validateSync(new Residence(ResidenceType.OTHER, 'Some description'))
      expect(errors).to.be.empty
    })

    it('should have an error when residence type is not provided', () => {
      const errors: ValidationError[] = validator.validateSync(new Residence())
      expectValidationError(errors, DefaultValidationErrors.SELECT_AN_OPTION)
    })

    it('should have an error when unknown residence type is provided', () => {
      const errors: ValidationError[] = validator.validateSync(new Residence(
        new ResidenceType('whoa', 'Whoa!')
      ))
      expectValidationError(errors, DefaultValidationErrors.SELECT_AN_OPTION)
    })

    it('should have an error when type is OTHER and housing details are not provided', () => {
      const errors: ValidationError[] = validator.validateSync(new Residence(
        ResidenceType.OTHER
      ))
      expectValidationError(errors, ValidationErrors.DESCRIBE_YOUR_HOUSING)
    })

    it('should have an error when type is OTHER and housing details are is blank', () => {
      const errors: ValidationError[] = validator.validateSync(new Residence(
        ResidenceType.OTHER,
        ''
      ))
      expectValidationError(errors, ValidationErrors.DESCRIBE_YOUR_HOUSING)
    })

    it('should have an error when provided details are too long', () => {
      const errors: ValidationError[] = validator.validateSync(new Residence(
        ResidenceType.OTHER,
        generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
      ))
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    it('should not validate housing details when type is not OTHER', () => {
      const errors: ValidationError[] = validator.validateSync(new Residence(
        ResidenceType.OWN_HOME,
        generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 100)
      ))
      expect(errors).to.be.empty
    })
  })
})
