import { expect } from 'chai'

import { Address, ValidationErrors } from 'app/forms/models/address'
import { Address as ClaimAddress } from 'claims/models/address'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../forms/models/validationUtils'
import * as randomstring from 'randomstring'

describe('Address', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should accept valid values (all given)', () => {
      const errors = validator.validateSync(new Address('line1', 'line2', 'city', 'postcode'))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid values (only required given)', () => {
      const errors = validator.validateSync(new Address('line1', '', 'city', 'postcode'))
      expect(errors.length).to.equal(0)
    })

    it('should reject when line 1 empty', () => {
      const errors = validator.validateSync(new Address('', 'line2', 'city', 'postcode'))
      expect(errors.length).to.equal(1)

      expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
    })

    it('should reject when line 1 too long', () => {
      const errors = validator.validateSync(new Address(generateString(101), 'line2', 'city', 'postcode'))
      expect(errors.length).to.equal(1)

      expectValidationError(errors, ValidationErrors.FIRST_LINE_TOO_LONG.replace('$constraint1', '100'))
    })

    it('should reject when line 2 too long', () => {
      const errors = validator.validateSync(new Address('line1', generateString(101), 'city', 'postcode'))
      expect(errors.length).to.equal(1)

      expectValidationError(errors, ValidationErrors.SECOND_LINE_TOO_LONG.replace('$constraint1', '100'))
    })

    it('should reject when city empty', () => {
      const errors = validator.validateSync(new Address('line1', 'line2', '', 'postcode'))
      expect(errors.length).to.equal(1)

      expectValidationError(errors, ValidationErrors.CITY_REQUIRED)
    })

    it('should reject when city too long', () => {
      const errors = validator.validateSync(new Address('line1', 'line2', generateString(101), 'postcode'))
      expect(errors.length).to.equal(1)

      expectValidationError(errors, ValidationErrors.CITY_NOT_VALID.replace('$constraint1', '100'))
    })

    it('should reject when postcode empty', () => {
      const errors = validator.validateSync(new Address('line1', 'line2', 'city', ''))
      expect(errors.length).to.equal(1)

      expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
    })

    it('should reject when postcode too long', () => {
      const errors = validator.validateSync(new Address('line1', 'line2', 'city', generateString(9)))
      expect(errors.length).to.equal(1)

      expectValidationError(errors, ValidationErrors.POSTCODE_NOT_VALID.replace('$constraint1', '8'))
    })

    it('should reject empty values', () => {
      const errors = validator.validateSync(new Address('', '', '', ''))

      expect(errors.length).to.equal(3)
      expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, ValidationErrors.CITY_REQUIRED)
      expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
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

  describe('deserialize', () => {
    it('should create a valid Address object', () => {
      const address: Address = new Address().deserialize({
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'postcode'
      })

      expect(address.line1).to.equal('line1')
      expect(address.line2).to.equal('line2')
      expect(address.city).to.equal('city')
      expect(address.postcode).to.equal('postcode')
    })
  })

  describe('isCompleted', () => {
    it('should return true when there is a postcode', () => {
      const input = {
        line1: 'Another lane',
        city: 'Manchester',
        postcode: 'SW8 4DA'
      }
      const add: Address = new Address().deserialize(input)
      expect(add.isCompleted()).to.equal(true)
    })

    it('should return false when the task is no postcode', () => {
      const add: Address = new Address()
      expect(add.isCompleted()).to.equal(false)
    })
  })
})

function generateString (length: number): string {
  return randomstring.generate({
    length: length,
    charset: 'alphabetic'
  })
}
