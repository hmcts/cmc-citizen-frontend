/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError, generateString, evaluateErrorMsg } from './validationUtils'
import {
  Address,
  ValidationErrors as AddressValidationErrors,
  ValidationConstants as AddressValidationConstants
} from 'forms/models/address'
import {
  CorrespondenceAddress,
  ValidationConstants as CorrespondenceAddressValidationConstants,
  ValidationErrors as CorrespondenceAddressValidationErrors
} from 'forms/models/correspondenceAddress'
import { Address as ClaimAddress } from 'claims/models/address'

describe('Address/CorrespondenceAddress', () => {
  [
    {
      classFunction: Address,
      validationErrors: AddressValidationErrors,
      validationConstants: AddressValidationConstants
    },
    {
      classFunction: CorrespondenceAddress,
      validationErrors: CorrespondenceAddressValidationErrors,
      validationConstants: CorrespondenceAddressValidationConstants
    }
  ].forEach((testInput) => {
    const ClassFunction = testInput.classFunction
    const ValidationErrors = testInput.validationErrors
    const exceededAddressLength: number = testInput.validationConstants.ADDRESS_MAX_LENGTH + 1
    const exceededPostcodeLength: number = testInput.validationConstants.POSTCODE_MAX_LENGTH + 1

    describe('constructor', () => {
      it('should set primitive type fields to undefined', () => {
        let address = new ClassFunction()
        expect(address.line1).to.be.undefined
        expect(address.line2).to.be.undefined
        expect(address.city).to.be.undefined
        expect(address.postcode).to.be.undefined
      })
    })

    describe('deserialize', () => {
      it('should return a Address instance initialised with defaults for undefined', () => {
        expect(new ClassFunction().deserialize(undefined)).to.eql(new ClassFunction())
      })

      it('should return a Address instance initialised with defaults for null', () => {
        expect(new ClassFunction().deserialize(null)).to.eql(new ClassFunction())
      })

      it('should return a Address instance with set fields from given object', () => {
        let result = new ClassFunction().deserialize({
          line1: 'AddressLine1',
          line2: 'AddressLine2',
          city: 'City',
          postcode: 'PostCode'
        })
        expect(result.line1).to.be.equals('AddressLine1')
        expect(result.line2).to.be.equals('AddressLine2')
        expect(result.city).to.be.equals('City')
        expect(result.postcode).to.be.equals('PostCode')
      })
    })

    describe('fromClaimAddress', () => {
      it('should create a valid Address object', () => {
        const claimAddress: ClaimAddress = new ClaimAddress().deserialize({
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'postcode'
        })

        const address: Address = Address.fromClaimAddress(claimAddress)

        expect(address.line1).to.equal(claimAddress.line1)
        expect(address.line2).to.equal(claimAddress.line2)
        expect(address.city).to.equal(claimAddress.city)
        expect(address.postcode).to.equal(claimAddress.postcode)
      })
    })

    describe('validation', () => {
      const validator: Validator = new Validator()

      it('should reject address with empty first address line and postcode', () => {
        const errors = validator.validateSync(new ClassFunction('', '', '', ''))

        expect(errors.length).to.equal(3)
        expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, ValidationErrors.CITY_REQUIRED)
        expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
      })

      it('should reject address with blank first address line and postcode', () => {
        const errors = validator.validateSync(new ClassFunction(' ', '', '', ' '))

        expect(errors.length).to.equal(3)
        expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, ValidationErrors.CITY_REQUIRED)
        expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
      })

      it('should reject address with first line longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction(generateString(exceededAddressLength), '', 'town', 'SA1'))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.FIRST_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH)
        )
      })

      it('should reject address with second line longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', generateString(exceededAddressLength), 'town', 'SA1'))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.SECOND_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH)
        )
      })

      it('should reject address with city longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', generateString(exceededAddressLength), 'SA1'))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.CITY_NOT_VALID, testInput.validationConstants.ADDRESS_MAX_LENGTH)
        )
      })

      it('should reject address with postcode longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', 'town', generateString(exceededPostcodeLength)))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.POSTCODE_NOT_VALID, testInput.validationConstants.POSTCODE_MAX_LENGTH)
        )
      })

      it('should accept valid address', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', 'Town', 'SA1'))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
