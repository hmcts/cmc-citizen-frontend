import { expect } from 'chai'
import {
  OrganisationDetails,
  ValidationConstraints as OrganisationDetailsValidationConstraints,
  ValidationErrors as OrganisationDetailsValidationErrors
} from 'forms/models/organisationDetails'
import { ValidationErrors as PartydDetailsValidationErrors } from 'forms/models/partyDetails'
import { PartyType } from 'common/partyType'
import { Address, ValidationErrors as AddressValidationErrors } from 'forms/models/address'
import { ValidationErrors as CorrespondenceAddressValidationErrors } from 'forms/models/correspondenceAddress'
import { ValidationError, Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'

const validAddress = new Address('line1', 'line2', 'line3', 'city', 'bb127nq')

describe('OrganisationDetails', () => {
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
      name: 'claimantName'
    }

    formInput = { ...input, hasCorrespondenceAddress: 'true' }
  })

  describe('constructor', () => {
    it('should initialise fields with defaults', () => {
      let organisationDetails: OrganisationDetails = new OrganisationDetails()
      expect(organisationDetails.address).to.be.instanceOf(Address)
      expect(organisationDetails.correspondenceAddress).to.be.instanceOf(Address)
      expect(organisationDetails.type).to.equal(PartyType.ORGANISATION.value)
      expect(organisationDetails.name).to.equal(undefined)
      expect(organisationDetails.hasCorrespondenceAddress).to.equal(false)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()
    let organisationDetails: OrganisationDetails

    beforeEach(() => {
      organisationDetails = new OrganisationDetails()
    })

    it('should return error when address is undefined', () => {
      organisationDetails.address = undefined
      let errors: ValidationError[] = validator.validateSync(organisationDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.ADDRESS_REQUIRED)
    })

    it('should return errors when required address fields are missing', () => {
      let errors: ValidationError[] = validator.validateSync(organisationDetails)
      expectValidationError(errors, AddressValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, AddressValidationErrors.POSTCODE_REQUIRED)
    })

    it('should return error when company name is undefined', () => {
      organisationDetails.name = undefined
      let errors: ValidationError[] = validator.validateSync(organisationDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when company name is blank', () => {
      organisationDetails.name = '  '
      let errors: ValidationError[] = validator.validateSync(organisationDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when company name got more than 255 character', () => {
      organisationDetails.name = generateString(256)
      organisationDetails.contactPerson = 'contactPerson'
      organisationDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(organisationDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_TOO_LONG.replace('$constraint1', '255'))
    })

    it('should return error when contact person got more than max length', () => {
      organisationDetails.contactPerson = generateString(OrganisationDetailsValidationConstraints.CONTACT_PERSON_MAX_LENGTH + 1)
      organisationDetails.name = 'claimantPerson'
      organisationDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(organisationDetails)
      expectValidationError(errors, OrganisationDetailsValidationErrors.CONTACT_PERSON_NAME_TOO_LONG.replace('$constraint1', '30'))
    })

    it('should return error when contact person has email address', () => {
      organisationDetails.contactPerson = 'test@domain.com'
      organisationDetails.name = 'claimantPerson'
      organisationDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(organisationDetails)
      expectValidationError(errors, OrganisationDetailsValidationErrors.CONTACT_PERSON_NAME_HAS_EMAIL)
    })
    describe('when "has correspondence address" flag is set to true', () => {
      beforeEach(() => {
        organisationDetails.address = validAddress
        organisationDetails.hasCorrespondenceAddress = true
        organisationDetails.contactPerson = 'ClaimantName'
        organisationDetails.name = 'test'
      })

      it('should return error when correspondence address is undefined', () => {
        organisationDetails.correspondenceAddress = undefined
        let errors: ValidationError[] = validator.validateSync(organisationDetails)
        expectValidationError(errors, PartydDetailsValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED)
      })

      it('should return errors when correspondence address required fields are missing', () => {
        let errors: ValidationError[] = validator.validateSync(organisationDetails)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.POSTCODE_REQUIRED)
      })

      it('should return no errors when correspondence address is provided', () => {
        organisationDetails.correspondenceAddress = validAddress
        let result = validator.validateSync(organisationDetails)
        expect(result.length).to.equal(0)
      })
    })

    describe('when "has correspondence address" flag is set to false', () => {
      it('should return no errors when correspondence address is not provided', () => {
        organisationDetails.address = validAddress
        organisationDetails.hasCorrespondenceAddress = false
        organisationDetails.contactPerson = 'ClaimantName'
        organisationDetails.name = 'test'
        let error = validator.validateSync(organisationDetails)
        expect(error.length).to.equal(0)
      })
    })
  })

  describe('deserialize', () => {
    it('should return object initialized with default values when given undefined', () => {
      let deserialized: OrganisationDetails = new OrganisationDetails().deserialize(undefined)
      expect(deserialized.address).to.be.instanceOf(Address)
      expect(deserialized.hasCorrespondenceAddress).to.equal(false)
      expect(deserialized.correspondenceAddress).to.be.instanceOf(Address)
      expect(deserialized.type).to.equal(PartyType.ORGANISATION.value)
      expect(deserialized.name).to.equal(undefined)
    })

    it('should return object with values set from provided input json', () => {
      let deserialized: OrganisationDetails = new OrganisationDetails().deserialize(input)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.ORGANISATION.value)
      expect(deserialized.name).to.equal('claimantName')
    })
  })

  describe('form object deserialization', () => {
    it('should return undefined when input is undefined', () => {
      expect(OrganisationDetails.fromObject(undefined)).to.equal(undefined)
    })

    it('should deserialize all fields', () => {
      let deserialized: OrganisationDetails = OrganisationDetails.fromObject(formInput)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.ORGANISATION.value)
      expect(deserialized.name).to.equal('claimantName')
    })

    it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
      formInput.hasCorrespondenceAddress = 'false'

      let deserialized: OrganisationDetails = OrganisationDetails.fromObject(formInput)

      expect(deserialized.correspondenceAddress).to.equal(undefined)
    })
  })

  describe('isCompleted', () => {
    let organisationDetails: OrganisationDetails

    beforeEach(() => {
      organisationDetails = new OrganisationDetails()
    })

    it('should return false when address is undefined', () => {
      organisationDetails.address = undefined
      expect(organisationDetails.isCompleted()).to.equal(false)
    })

    it('should return false when address is not completed', () => {
      organisationDetails.address = new Address()
      expect(organisationDetails.isCompleted()).to.equal(false)
    })

    it('should return true when address is completed and does not have correspondence address', () => {
      organisationDetails.address = validAddress
      organisationDetails.hasCorrespondenceAddress = false
      organisationDetails.name = 'claimantName'
      organisationDetails.contactPerson = 'contactPerson'
      expect(organisationDetails.isCompleted()).to.equal(true)
    })

    it('should return false when has correspondence address and correspondence address is undefined', () => {
      organisationDetails.address = validAddress
      organisationDetails.hasCorrespondenceAddress = true
      organisationDetails.correspondenceAddress = undefined
      expect(organisationDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has name is undefined', () => {
      organisationDetails.address = validAddress
      organisationDetails.name = undefined
      organisationDetails.hasCorrespondenceAddress = true
      organisationDetails.correspondenceAddress = validAddress
      expect(organisationDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has correspondence address and correspondence address is not completed', () => {
      organisationDetails.address = validAddress
      organisationDetails.hasCorrespondenceAddress = true
      organisationDetails.correspondenceAddress = new Address()
      expect(organisationDetails.isCompleted()).to.equal(false)
    })

    it('should return true when all the required fields are completed', () => {
      organisationDetails.address = validAddress
      organisationDetails.name = 'claimantName'
      organisationDetails.contactPerson = 'contactPerson'
      organisationDetails.hasCorrespondenceAddress = true
      organisationDetails.correspondenceAddress = validAddress
      expect(organisationDetails.isCompleted()).to.equal(true)
    })
  })
})
