/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { evaluateErrorMsg, expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import {
  Address,
  ValidationConstants as AddressValidationConstants,
  ValidationErrors as AddressValidationErrors
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

    describe('constructor', () => {
      it('should set primitive type fields to undefined', () => {
        let address = new ClassFunction()
        expect(address.line1).to.be.undefined
        expect(address.line2).to.be.undefined
        expect(address.line3).to.be.undefined
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
          line3: 'AddressLine3',
          city: 'City',
          postcode: 'PostCode'
        })
        expect(result.line1).to.be.equals('AddressLine1')
        expect(result.line2).to.be.equals('AddressLine2')
        expect(result.line3).to.be.equals('AddressLine3')
        expect(result.city).to.be.equals('City')
        expect(result.postcode).to.be.equals('PostCode')
      })
    })

    describe('fromClaimAddress', () => {
      it('should create a valid Address object', () => {
        const claimAddress: ClaimAddress = new ClaimAddress().deserialize({
          line1: 'line1',
          line2: 'line2',
          line3: 'line3',
          city: 'city',
          postcode: 'postcode'
        })

        const address: Address = Address.fromClaimAddress(claimAddress)

        expect(address.line1).to.equal(claimAddress.line1)
        expect(address.line2).to.equal(claimAddress.line2)
        expect(address.line3).to.equal(claimAddress.line3)
        expect(address.city).to.equal(claimAddress.city)
        expect(address.postcode).to.equal(claimAddress.postcode)
      })
    })

    describe('validation', () => {
      const validator: Validator = new Validator()

      it('should reject address with empty first address line and postcode', async () => {
        const errors = await validator.validate(new ClassFunction('', '', '', '', ''))

        expect(errors.length).to.equal(3)
        expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, ValidationErrors.CITY_REQUIRED)
        expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
      })

      it('should reject address with blank first address line and postcode', () => {
        const errors = validator.validateSync(new ClassFunction(' ', '', '', '', ' '))

        expect(errors.length).to.equal(3)
        expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, ValidationErrors.CITY_REQUIRED)
        expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
      })

      it('should reject address with first line longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction(generateString(exceededAddressLength), '', '', 'town', 'bb127nq'))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.FIRST_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH)
        )
      })

      it('should reject address with second line longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', generateString(exceededAddressLength), '', 'town', 'bb127nq'))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.SECOND_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH)
        )
      })

      it('should reject address with third line longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', generateString(exceededAddressLength), 'town', 'bb127nq'))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.THIRD_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH)
        )
      })

      it('should reject address with city longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', generateString(exceededAddressLength), 'bb127nq'))

        expect(errors.length).to.equal(1)
        expectValidationError(
          errors, evaluateErrorMsg(ValidationErrors.CITY_NOT_VALID, testInput.validationConstants.ADDRESS_MAX_LENGTH)
        )
      })

      it('should reject address with postcode longer then upper limit', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', 'town', generateString(9)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.POSTCODE_NOT_VALID)
      })

      it('should reject address with invalid postcode', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', 'Town', 'bb1012345'))

        expect(errors.length).to.equal(1)
      })

      it('should accept valid address', () => {
        const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', 'Town', 'bb127nq'))

        expect(errors.length).to.equal(0)
      })

      context('address list is not visible and address inputs are not visible', () => {
        it('should reject when postcode fields are not populated', () => {
          const address = new ClassFunction()
          address.addressVisible = false
          address.addressSelectorVisible = false
          const errors = validator.validateSync(address)

          expect(errors.length).to.equal(1)
        })
      })

      context('address list is visible but none selected', () => {
        it('should reject when address is not selected', () => {
          const address = new ClassFunction()
          address.addressVisible = false
          address.addressSelectorVisible = true
          const errors = validator.validateSync(address)
          expect(errors.length).to.equal(1)
        })
      })

      context('address list is visible and address selected', () => {
        it('should accept when address is provided', () => {
          const address = new ClassFunction('line1', '', '', 'city', 'bb127nq')
          address.addressVisible = true
          address.addressSelectorVisible = true
          const errors = validator.validateSync(address)
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
