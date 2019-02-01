import { expect } from 'chai'
import { SoleTraderDetails, ValidationErrors as SoleTraderDetailsValidationErrors } from 'forms/models/soleTraderDetails'
import { ValidationErrors as PartydDetailsValidationErrors } from 'forms/models/partyDetails'
import { PartyType } from 'common/partyType'
import { Address, ValidationErrors as AddressValidationErrors } from 'forms/models/address'
import { ValidationErrors as CorrespondenceAddressValidationErrors } from 'forms/models/correspondenceAddress'
import { ValidationError, Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
const validAddress = new Address('line1', 'line2', 'line3', 'city', 'bb127nq')

const aVeryLongString = (): string => {
  return 'aVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongString' +
         'aVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringa'
}
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
      name: 'claimantName'
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
      expectValidationError(errors, PartydDetailsValidationErrors.ADDRESS_REQUIRED)
    })

    it('should return errors when required address fields are missing', () => {
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, AddressValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, AddressValidationErrors.POSTCODE_REQUIRED)
    })

    it('should return error when name is undefined', () => {
      soleTraderDetails.name = undefined
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when name is blank', () => {
      soleTraderDetails.name = '  '
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when name got more than 255 character', () => {
      soleTraderDetails.name = aVeryLongString()
      soleTraderDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, PartydDetailsValidationErrors.NAME_TOO_LONG.replace('$constraint1','255'))
    })

    it('should return no error when business name is blank', () => {
      soleTraderDetails.businessName = '   '
      soleTraderDetails.name = 'claimantName'
      soleTraderDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expect(errors.length).to.equal(0)
    })

    it('should return error when name got more than 255 character', () => {
      soleTraderDetails.businessName = aVeryLongString()
      soleTraderDetails.name = 'claimantName'
      soleTraderDetails.address = validAddress
      let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
      expectValidationError(errors, SoleTraderDetailsValidationErrors.ORGANISATION_NAME_TOO_LONG.replace('$constraint1','35'))
    })

    describe('when "has correspondence address" flag is set to true', () => {
      beforeEach(() => {
        soleTraderDetails.address = validAddress
        soleTraderDetails.hasCorrespondenceAddress = true
        soleTraderDetails.name = 'ClaimantName'
        soleTraderDetails.businessName = 'test'
      })

      it('should return error when correspondence address is undefined', () => {
        soleTraderDetails.correspondenceAddress = undefined
        let errors: ValidationError[] = validator.validateSync(soleTraderDetails)
        expectValidationError(errors, PartydDetailsValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED)
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
        soleTraderDetails.name = 'ClaimantName'
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
      expect(deserialized.name).to.equal('claimantName')
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
      expect(deserialized.name).to.equal('claimantName')
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
      soleTraderDetails.name = 'claimantName'
      expect(soleTraderDetails.isCompleted()).to.equal(true)
    })

    it('should return false when has correspondence address and correspondence address is undefined', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = undefined
      expect(soleTraderDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has name is undefined', () => {
      soleTraderDetails.address = validAddress
      soleTraderDetails.name = undefined
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
      soleTraderDetails.name = 'claimantName'
      soleTraderDetails.hasCorrespondenceAddress = true
      soleTraderDetails.correspondenceAddress = validAddress
      expect(soleTraderDetails.isCompleted()).to.equal(true)
    })
  })
})
