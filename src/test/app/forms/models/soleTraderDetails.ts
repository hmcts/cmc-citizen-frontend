import { expect } from 'chai'
import {
  SoleTraderDetails,
  ValidationErrors as SoleTraderDetailsValidationErrors
} from 'forms/models/soleTraderDetails'
import { ValidationErrors as PartyDetailsValidationErrors } from 'forms/models/partyDetails'
import { ValidationErrors as SplitNamedPartyDetailsValidationErrors } from 'forms/models/splitNamedPartyDetails'
import { PartyType } from 'common/partyType'
import { Address, ValidationErrors as AddressValidationErrors } from 'forms/models/address'
import { ValidationErrors as CorrespondenceAddressValidationErrors } from 'forms/models/correspondenceAddress'
import { ValidationError, Validator } from '@hmcts/class-validator'
import {
  expectValidationError,
  expectValidationErrorNotPresent,
  generateString
} from 'test/app/forms/models/validationUtils'

const validAddress = new Address('line1', 'line2', 'line3', 'city', 'bb127nq')

describe('SoleTraderDetails', () => {
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
      },
      firstName: 'claimantName',
      lastName: 'claimantLastname'
    }

    formInput = { ...input, hasCorrespondenceAddress: 'true' }
  })

  describe('constructor', () => {
    it('should initialise fields with defaults', () => {
      let soleTraderDetails: SoleTraderDetails = new SoleTraderDetails()
      expect(soleTraderDetails.address).to.be.instanceOf(Address)
      expect(soleTraderDetails.correspondenceAddress).to.be.instanceOf(Address)
      expect(soleTraderDetails.type).to.equal(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value)
      expect(soleTraderDetails.name).to.equal(undefined)
      expect(soleTraderDetails.title).to.equal(undefined)
      expect(soleTraderDetails.firstName).to.equal(undefined)
      expect(soleTraderDetails.lastName).to.equal(undefined)
      expect(soleTraderDetails.hasCorrespondenceAddress).to.equal(false)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()
    let soleTraderDetails: SoleTraderDetails

    beforeEach(() => {
      soleTraderDetails = new SoleTraderDetails()
    })

    it('should return error when address is undefined', () => {
      soleTraderDetails.address = undefined
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.ADDRESS_REQUIRED)
    })

    it('should return errors when required address fields are missing', () => {
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, AddressValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, AddressValidationErrors.POSTCODE_REQUIRED)
    })

    it('should return error when name is undefined if firstName and lastName are undefined', () => {
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = undefined
      soleTraderDetails.lastName = undefined
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when name is blank if firstName and lastName are undefined', () => {
      soleTraderDetails.name = '  '
      soleTraderDetails.firstName = undefined
      soleTraderDetails.lastName = undefined
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when name has more than 255 character if firstName and lastName are undefined', () => {
      soleTraderDetails.name = generateString(256)
      soleTraderDetails.firstName = undefined
      soleTraderDetails.lastName = undefined
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.errorTooLong('Name').replace('$constraint1','255'))
    })

    it('should return error when firstName is undefined if name is undefined', () => {
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = undefined
      soleTraderDetails.lastName = 'some name'
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationErrorNotPresent(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.FIRSTNAME_REQUIRED)
      expectValidationErrorNotPresent(errors, SplitNamedPartyDetailsValidationErrors.LASTNAME_REQUIRED)
    })

    it('should return error when firstName is blank if name is undefined', () => {
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = '  '
      soleTraderDetails.lastName = 'some name'
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationErrorNotPresent(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.FIRSTNAME_REQUIRED)
      expectValidationErrorNotPresent(errors, SplitNamedPartyDetailsValidationErrors.LASTNAME_REQUIRED)
    })

    it('should return error when firstName has more than 255 character if name is undefined', () => {
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = generateString(256)
      soleTraderDetails.lastName = 'some name'
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.errorTooLong('First name').replace('$constraint1','255'))
    })

    it('should return error when lastName is undefined if name is undefined', () => {
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = 'some name'
      soleTraderDetails.lastName = undefined
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationErrorNotPresent(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
      expectValidationErrorNotPresent(errors, SplitNamedPartyDetailsValidationErrors.FIRSTNAME_REQUIRED)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.LASTNAME_REQUIRED)
    })

    it('should return error when lastName is blank if name is undefined', () => {
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = 'some name'
      soleTraderDetails.lastName = '  '
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationErrorNotPresent(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
      expectValidationErrorNotPresent(errors, SplitNamedPartyDetailsValidationErrors.FIRSTNAME_REQUIRED)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.LASTNAME_REQUIRED)
    })

    it('should return error when lastName has more than 255 character if name is undefined', () => {
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = 'some name'
      soleTraderDetails.lastName = generateString(256)
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.errorTooLong('Last name').replace('$constraint1','255'))
    })

    it('should return error when title has more than 35 characters', () => {
      soleTraderDetails.title = generateString(36)
      soleTraderDetails.firstName = 'some name'
      soleTraderDetails.lastName = 'some name'
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, SplitNamedPartyDetailsValidationErrors.errorTooLong('Title').replace('$constraint1','35'))
    })

    it('should return no error when business name is blank', () => {
      soleTraderDetails.businessName = '   '
      soleTraderDetails.firstName = 'claimantName'
      soleTraderDetails.lastName = 'claimantName'
      soleTraderDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expect(errors.length).to.equal(0)
    })

    it('should return error when business name has more than 255 character', () => {
      soleTraderDetails.businessName = generateString(256)
      soleTraderDetails.firstName = 'claimantName'
      soleTraderDetails.lastName = 'claimantName'
      soleTraderDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, SoleTraderDetailsValidationErrors.ORGANISATION_NAME_TOO_LONG.replace('$constraint1','35'))
    })

    describe('when "has correspondence address" flag is set to true', () => {
      beforeEach(() => {
        soleTraderDetails.address = validAddress
        soleTraderDetails.hasCorrespondenceAddress = true
        soleTraderDetails.firstName = 'claimantName'
        soleTraderDetails.lastName = 'claimantName'
        soleTraderDetails.businessName = 'test'
      })

      it('should return error when correspondence address is undefined', () => {
        soleTraderDetails.correspondenceAddress = undefined
        let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
        expectValidationError(errors, PartyDetailsValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED)
      })

      it('should return errors when correspondence address required fields are missing', () => {
        let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.POSTCODE_REQUIRED)
      })

      it('should return no errors when correspondence address is provided', () => {
        soleTraderDetails.correspondenceAddress = validAddress
        let result = validator.validateSync(soleTraderDetails)
        expect(result.length).to.equal(0)
      })
    })

    describe('when "has correspondence address" flag is set to false', () => {
      it('should return no errors when correspondence address is not provided', () => {
        soleTraderDetails.address = validAddress
        soleTraderDetails.hasCorrespondenceAddress = false
        soleTraderDetails.firstName = 'claimantName'
        soleTraderDetails.lastName = 'claimantName'
        soleTraderDetails.businessName = 'test'
        let error = validator.validateSync(soleTraderDetails)
        expect(error.length).to.equal(0)
      })
    })
  })

  describe('deserialize', () => {
    it('should return object initialized with default values when given undefined', () => {
      let deserialized: SoleTraderDetails = new SoleTraderDetails().deserialize(undefined)
      expect(deserialized.address).to.be.instanceOf(Address)
      expect(deserialized.hasCorrespondenceAddress).to.equal(false)
      expect(deserialized.correspondenceAddress).to.be.instanceOf(Address)
      expect(deserialized.type).to.equal(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value)
      expect(deserialized.name).to.equal(undefined)
      expect(deserialized.firstName).to.equal(undefined)
      expect(deserialized.lastName).to.equal(undefined)
      expect(deserialized.title).to.equal(undefined)
    })

    it('should return object with values set from provided input json', () => {
      let deserialized: SoleTraderDetails = new SoleTraderDetails().deserialize(input)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value)
      expect(deserialized.name).to.equal('claimantName claimantLastname')
      expect(deserialized.firstName).to.equal('claimantName')
      expect(deserialized.lastName).to.equal('claimantLastname')
      expect(deserialized.title).to.equal(undefined)
    })
  })

  describe('form object deserialization', () => {
    it('should return undefined when input is undefined', () => {
      expect(SoleTraderDetails.fromObject(undefined)).to.equal(undefined)
    })

    it('should deserialize all fields', () => {
      let deserialized: SoleTraderDetails = SoleTraderDetails.fromObject(formInput)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value)
      expect(deserialized.name).to.equal('claimantName claimantLastname')
      expect(deserialized.firstName).to.equal('claimantName')
      expect(deserialized.lastName).to.equal('claimantLastname')
    })

    it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
      formInput.hasCorrespondenceAddress = 'false'

      let deserialized: SoleTraderDetails = SoleTraderDetails.fromObject(formInput)

      expect(deserialized.correspondenceAddress).to.equal(undefined)
    })
  })

  describe('isCompleted', () => {
    let soleTraderDetails: SoleTraderDetails

    beforeEach(() => {
      soleTraderDetails = new SoleTraderDetails()
      soleTraderDetails.businessName = ''
    })

    it('should return false when address is undefined', () => {
      soleTraderDetails.address = undefined
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return false when address is not completed', () => {
      soleTraderDetails.address = new Address()
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return true when address is completed and does not have correspondence address', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.hasCorrespondenceAddress = false
      soleTraderDetails.firstName = 'claimantName'
      soleTraderDetails.lastName = 'claimantName'
      expect(soleTraderDetails.isCompleted()).to.equal(true)
    })

    it('should return false when has correspondence address and correspondence address is undefined', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = undefined
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has name is undefined and first name is undefined', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = undefined
      soleTraderDetails.lastName = 'McCoffee'
      soleTraderDetails.businessName = 'business'
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = validAddress
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has name is undefined and last name is undefined', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = 'Coffee'
      soleTraderDetails.lastName = undefined
      soleTraderDetails.businessName = 'business'
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = validAddress
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has name is undefined and first and last name are undefined', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.name = undefined
      soleTraderDetails.firstName = undefined
      soleTraderDetails.lastName = undefined
      soleTraderDetails.businessName = 'business'
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = validAddress
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has correspondence address and correspondence address is not completed', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = new Address()
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return true when all the required fields are completed', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.firstName = 'claimantName'
      soleTraderDetails.lastName = 'claimantName'
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = validAddress
      expect(soleTraderDetails.isCompleted()).to.equal(true)
    })
  })
})
