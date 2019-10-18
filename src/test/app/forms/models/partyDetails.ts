import { expect } from 'chai'

import { PartyDetails, ValidationErrors } from 'forms/models/partyDetails'
import { Address, ValidationErrors as AddressValidationErrors } from 'forms/models/address'
import { ValidationErrors as CorrespondenceAddressValidationErrors } from 'forms/models/correspondenceAddress'
import { ValidationError, Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

const validAddress = new Address('line1', 'line2', 'line3', 'city', 'bb127nq')

describe('PartyDetails', () => {
  let input
  let formInput

  beforeEach(() => {
    input = {
      address: {
        line1: 'first line',
        postcode: 'bb127nq'
      },
      hasCorrespondenceAddress: true,
      correspondenceAddress: {
        line1: 'another line',
        city: 'some city',
        postcode: 'bb127nq'
      }
    }

    formInput = { ...input, hasCorrespondenceAddress: 'true' }
  })

  describe('constructor', () => {
    it('should initialise object fields with new instances', () => {
      let partyDetails: PartyDetails = new PartyDetails()
      expect(partyDetails.address).to.be.instanceOf(Address)
      expect(partyDetails.correspondenceAddress).to.be.instanceOf(Address)
    })

    it('should initialise hasCorrespondenceAddress to false by default', () => {
      let partyDetails: PartyDetails = new PartyDetails()
      expect(partyDetails.hasCorrespondenceAddress).to.equal(false)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()
    let partyDetails: PartyDetails

    beforeEach(() => {
      partyDetails = new PartyDetails()
    })

    it('should return error when address is undefined', () => {
      partyDetails.address = undefined
      let errors: ValidationError[] = validator.validateSync(partyDetails)
      expectValidationError(errors, ValidationErrors.ADDRESS_REQUIRED)
    })

    it('should return errors when required address fields are missing', () => {
      let errors: ValidationError[] = validator.validateSync(partyDetails)
      expectValidationError(errors, AddressValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, AddressValidationErrors.CITY_REQUIRED)
      expectValidationError(errors, AddressValidationErrors.POSTCODE_REQUIRED)
    })

    describe('when "has correspondence address" flag is set to true', () => {
      beforeEach(() => {
        partyDetails.address = validAddress
        partyDetails.hasCorrespondenceAddress = true
      })

      it('should return error when correspondence address is undefined', () => {
        partyDetails.correspondenceAddress = undefined
        let errors: ValidationError[] = validator.validateSync(partyDetails)
        expectValidationError(errors, ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED)
      })

      it('should return errors when correspondence address required fields are missing', () => {
        let errors: ValidationError[] = validator.validateSync(partyDetails)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.CITY_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.POSTCODE_REQUIRED)
      })

      it('should return errors when correspondence address fields have too long values', () => {
        let errors: ValidationError[] = validator.validateSync(partyDetails)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.CITY_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.POSTCODE_REQUIRED)
      })

      it('should return no errors when correspondence address is provided', () => {
        partyDetails.correspondenceAddress = validAddress
        partyDetails.name = 'claimantName'
        expect(validator.validateSync(partyDetails).length).to.equal(0)
      })
    })

    describe('when "has correspondence address" flag is set to false', () => {
      it('should return no errors when correspondence address is not provided', () => {
        partyDetails.address = validAddress
        partyDetails.hasCorrespondenceAddress = false
        partyDetails.name = 'claimantName'
        expect(validator.validateSync(partyDetails).length).to.equal(0)
      })
    })
  })

  describe('deserialize', () => {
    it('should return object initialized with default values when given undefined', () => {
      let deserialized: PartyDetails = new PartyDetails().deserialize(undefined)
      expect(deserialized.address).to.be.instanceOf(Address)
      expect(deserialized.hasCorrespondenceAddress).to.equal(false)
      expect(deserialized.correspondenceAddress).to.be.instanceOf(Address)
    })

    it('should return object with values set from provided input json', () => {
      let deserialized: PartyDetails = new PartyDetails().deserialize(input)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
    })
  })

  describe('form object deserialization', () => {
    it('should return undefined when input is undefined', () => {
      expect(PartyDetails.fromObject(undefined)).to.equal(undefined)
    })

    it('should deserialize all fields', () => {
      let deserialized: PartyDetails = PartyDetails.fromObject(formInput)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(undefined)
    })

    it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
      formInput.hasCorrespondenceAddress = 'false'

      let deserialized: PartyDetails = PartyDetails.fromObject(formInput)

      expect(deserialized.correspondenceAddress).to.equal(undefined)
    })
  })

  describe('isCompleted', () => {
    let partyDetails: PartyDetails

    beforeEach(() => {
      partyDetails = new PartyDetails()
    })

    it('should return false when address is undefined', () => {
      partyDetails.address = undefined
      expect(partyDetails.isCompleted()).to.equal(false)
    })

    it('should return false when address is not completed', () => {
      partyDetails.address = new Address()
      expect(partyDetails.isCompleted()).to.equal(false)
    })

    it('should return true when address is completed and does not have correspondence address', () => {
      partyDetails.address = validAddress
      partyDetails.hasCorrespondenceAddress = false
      partyDetails.name = 'claimantName'
      expect(partyDetails.isCompleted()).to.equal(true)
    })

    it('should return false when has correspondence address and correspondence address is undefined', () => {
      partyDetails.address = validAddress
      partyDetails.hasCorrespondenceAddress = true
      partyDetails.correspondenceAddress = undefined
      expect(partyDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has correspondence address and correspondence address is not completed', () => {
      partyDetails.address = validAddress
      partyDetails.hasCorrespondenceAddress = true
      partyDetails.correspondenceAddress = new Address()
      expect(partyDetails.isCompleted()).to.equal(false)
    })

    it('should return true when has correspondence address and correspondence address is completed', () => {
      partyDetails.address = validAddress
      partyDetails.hasCorrespondenceAddress = true
      partyDetails.correspondenceAddress = validAddress
      partyDetails.name = 'claimantName'
      expect(partyDetails.isCompleted()).to.equal(true)
    })
  })
})
