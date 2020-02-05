import { expect } from 'chai'
import { CompanyDetails, ValidationErrors as CompanyDetailsValidationErrors } from 'forms/models/companyDetails'
import { ValidationErrors as PartydDetailsValidationErrors } from 'forms/models/partyDetails'
import { PartyType } from 'common/partyType'
import { Address, ValidationErrors as AddressValidationErrors } from 'forms/models/address'
import { ValidationErrors as CorrespondenceAddressValidationErrors } from 'forms/models/correspondenceAddress'
import { ValidationError, Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'

const validAddress = new Address('line1', 'line2', 'line3', 'city', 'bb127nq')

describe('CompanyDetails', () => {
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
      name: 'companyName'
    }

    formInput = { ...input, hasCorrespondenceAddress: 'true' }
  })

  describe('constructor', () => {
    it('should initialise fields with defaults', () => {
      let companyDetails: CompanyDetails = new CompanyDetails()
      expect(companyDetails.address).to.be.instanceOf(Address)
      expect(companyDetails.correspondenceAddress).to.be.instanceOf(Address)
      expect(companyDetails.type).to.equal(PartyType.COMPANY.value)
      expect(companyDetails.name).to.equal(undefined)
      expect(companyDetails.hasCorrespondenceAddress).to.equal(false)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()
    let companyDetails: CompanyDetails

    beforeEach(() => {
      companyDetails = new CompanyDetails()
    })

    it('should return error when address is undefined', () => {
      companyDetails.address = undefined
      let errors: ValidationError[] = validator.validateSync(companyDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.ADDRESS_REQUIRED)
    })

    it('should return errors when required address fields are missing', () => {
      let errors: ValidationError[] = validator.validateSync(companyDetails)
      expectValidationError(errors, AddressValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, AddressValidationErrors.POSTCODE_REQUIRED)
    })

    it('should return error when company name is undefined', () => {
      companyDetails.name = undefined
      let errors: ValidationError[] = validator.validateSync(companyDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when company name is blank', () => {
      companyDetails.name = '  '
      let errors: ValidationError[] = validator.validateSync(companyDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when company name got more than 255 character', () => {
      companyDetails.name = generateString(256)
      companyDetails.contactPerson = 'contactPerson'
      companyDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(companyDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_TOO_LONG.replace('$constraint1','255'))
    })

    it('should return error when contact person got more than 255 character', () => {
      companyDetails.contactPerson = generateString(256)
      companyDetails.name = 'companyName'
      companyDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(companyDetails)
      expectValidationError(errors, CompanyDetailsValidationErrors.CONTACT_PERSON_NAME_TOO_LONG.replace('$constraint1','30'))
    })

    it('should return error when contact person has email address', () => {
      companyDetails.contactPerson = 'test@domain.com'
      companyDetails.name = 'companyName'
      companyDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(companyDetails)
      expectValidationError(errors, CompanyDetailsValidationErrors.CONTACT_PERSON_NAM_HAS_EMAIL)
    })

    describe('when "has correspondence address" flag is set to true', () => {
      beforeEach(() => {
        companyDetails.address = validAddress
        companyDetails.hasCorrespondenceAddress = true
        companyDetails.contactPerson = 'ClaimantName'
        companyDetails.name = 'test'
      })

      it('should return error when correspondence address is undefined', () => {
        companyDetails.correspondenceAddress = undefined
        let errors: ValidationError[] = validator.validateSync(companyDetails)
        expectValidationError(errors, PartydDetailsValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED)
      })

      it('should return errors when correspondence address required fields are missing', () => {
        let errors: ValidationError[] = validator.validateSync(companyDetails)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.POSTCODE_REQUIRED)
      })

      it('should return no errors when correspondence address is provided', () => {
        companyDetails.correspondenceAddress = validAddress
        let result = validator.validateSync(companyDetails)
        expect(result.length).to.equal(0)
      })
    })

    describe('when "has correspondence address" flag is set to false', () => {
      it('should return no errors when correspondence address is not provided', () => {
        companyDetails.address = validAddress
        companyDetails.hasCorrespondenceAddress = false
        companyDetails.contactPerson = 'ClaimantName'
        companyDetails.name = 'test'
        let error = validator.validateSync(companyDetails)
        expect(error.length).to.equal(0)
      })
    })
  })

  describe('deserialize', () => {
    it('should return object initialized with default values when given undefined', () => {
      let deserialized: CompanyDetails = new CompanyDetails().deserialize(undefined)
      expect(deserialized.address).to.be.instanceOf(Address)
      expect(deserialized.hasCorrespondenceAddress).to.equal(false)
      expect(deserialized.correspondenceAddress).to.be.instanceOf(Address)
      expect(deserialized.type).to.equal(PartyType.COMPANY.value)
      expect(deserialized.name).to.equal(undefined)
      expect(deserialized.contactPerson).to.equal(undefined)
    })

    it('should return object with values set from provided input json', () => {
      let deserialized: CompanyDetails = new CompanyDetails().deserialize(input)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.COMPANY.value)
      expect(deserialized.name).to.equal('companyName')
      expect(deserialized.contactPerson).to.equal(undefined)
    })
  })

  describe('form object deserialization', () => {
    it('should return undefined when input is undefined', () => {
      expect(CompanyDetails.fromObject(undefined)).to.equal(undefined)
    })

    it('should deserialize all fields', () => {
      let deserialized: CompanyDetails = CompanyDetails.fromObject(formInput)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.COMPANY.value)
      expect(deserialized.name).to.equal('companyName')
      expect(deserialized.contactPerson).to.equal(undefined)
    })

    it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
      formInput.hasCorrespondenceAddress = 'false'

      let deserialized: CompanyDetails = CompanyDetails.fromObject(formInput)

      expect(deserialized.correspondenceAddress).to.equal(undefined)
    })
  })

  describe('isCompleted', () => {
    let companyDetails: CompanyDetails

    beforeEach(() => {
      companyDetails = new CompanyDetails()
      companyDetails.name = 'John Smith'
      companyDetails.address = validAddress
      companyDetails.hasCorrespondenceAddress = true
      companyDetails.correspondenceAddress = validAddress
      companyDetails.contactPerson = ''
    })

    it('should return false when has name is undefined', () => {
      companyDetails.name = undefined
      expect(companyDetails.isCompleted()).to.equal(false)
    })

    it('should return false when address is undefined', () => {
      companyDetails.address = undefined
      expect(companyDetails.isCompleted()).to.equal(false)
    })

    it('should return false when address is not completed', () => {
      companyDetails.address = new Address()
      expect(companyDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has correspondence address and correspondence address is undefined', () => {
      companyDetails.hasCorrespondenceAddress = true
      companyDetails.correspondenceAddress = undefined
      expect(companyDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has correspondence address and correspondence address is not completed', () => {
      companyDetails.hasCorrespondenceAddress = true
      companyDetails.correspondenceAddress = new Address()
      expect(companyDetails.isCompleted()).to.equal(false)
    })

    it('should return true when address is completed and does not have correspondence address', () => {
      companyDetails.hasCorrespondenceAddress = false
      companyDetails.correspondenceAddress = undefined
      expect(companyDetails.isCompleted()).to.equal(true)
    })

    it('should return true when all the required fields are completed', () => {
      expect(companyDetails.isCompleted()).to.equal(true)
    })
  })
})
