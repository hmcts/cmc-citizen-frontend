import { expect } from 'chai'
import { DateOfBirth } from 'app/forms/models/dateOfBirth'
import { IndividualDetails } from 'forms/models/individualDetails'
import { ValidationErrors as PartyDetailsValidationErrors } from 'forms/models/partyDetails'
import { PartyType } from 'app/common/partyType'
import { Address, ValidationErrors as AddressValidationErrors } from 'forms/models/address'
import { ValidationErrors as CorrespondenceAddressValidationErrors } from 'forms/models/correspondenceAddress'
import { ValidationError, Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import { LocalDate } from 'forms/models/localDate'
const validAddress = new Address('line1', 'line2', 'city', 'postcode')

const aVeryLongString = (): string => {
  return 'aVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongString' +
         'aVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringaVeryLongStringa'
}
describe('IndividualDetails', () => {
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
      name: 'claimantName',
      dateOfBirth: {
        known: 'true',
        date: {
          year: 2017,
          month: 12,
          day: 31
        }
      }
    }

    formInput = { ...input, hasCorrespondenceAddress: 'true' }
  })

  describe('constructor', () => {
    it('should initialise fields with defaults', () => {
      let individualDetails: IndividualDetails = new IndividualDetails()
      expect(individualDetails.address).to.be.instanceOf(Address)
      expect(individualDetails.correspondenceAddress).to.be.instanceOf(Address)
      expect(individualDetails.type).to.equal(PartyType.INDIVIDUAL.value)
      expect(individualDetails.name).to.equal(undefined)
      expect(individualDetails.dateOfBirth).to.equal(undefined)
      expect(individualDetails.hasCorrespondenceAddress).to.equal(false)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()
    let individualDetails: IndividualDetails

    beforeEach(() => {
      individualDetails = new IndividualDetails()
    })

    it('should return error when address is undefined', () => {
      individualDetails.address = undefined
      let errors: ValidationError[] = validator.validateSync(individualDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.ADDRESS_REQUIRED)
    })

    it('should return errors when required address fields are missing', () => {
      let errors: ValidationError[] = validator.validateSync(individualDetails)
      expectValidationError(errors, AddressValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, AddressValidationErrors.POSTCODE_REQUIRED)
    })

    it('should return error when name is undefined', () => {
      individualDetails.name = undefined
      let errors: ValidationError[] = validator.validateSync(individualDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when name is blank', () => {
      individualDetails.name = '  '
      let errors: ValidationError[] = validator.validateSync(individualDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when name got more than 255 character', () => {
      individualDetails.name = aVeryLongString()
      let errors: ValidationError[] = validator.validateSync(individualDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.NAME_TOO_LONG.replace('$constraint1','255'))
    })

    it('should return error when dataOfBirth is undefined', () => {
      individualDetails.dateOfBirth = undefined
      let errors: ValidationError[] = validator.validateSync(individualDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
    })

    it('should return error when dataOfBirth is null', () => {
      individualDetails.dateOfBirth = null
      let errors: ValidationError[] = validator.validateSync(individualDetails)
      expectValidationError(errors, PartyDetailsValidationErrors.NAME_REQUIRED)
    })

    describe('when "has correspondence address" flag is set to true', () => {
      beforeEach(() => {
        individualDetails.address = validAddress
        individualDetails.hasCorrespondenceAddress = true
        individualDetails.name = 'ClaimantName'
        individualDetails.dateOfBirth = new DateOfBirth()
      })

      it('should return error when correspondence address is undefined', () => {
        individualDetails.correspondenceAddress = undefined
        let errors: ValidationError[] = validator.validateSync(individualDetails)
        expectValidationError(errors, PartyDetailsValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED)
      })

      it('should return errors when correspondence address required fields are missing', () => {
        let errors: ValidationError[] = validator.validateSync(individualDetails)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.FIRST_LINE_REQUIRED)
        expectValidationError(errors, CorrespondenceAddressValidationErrors.POSTCODE_REQUIRED)
      })

      it('should return no errors when correspondence address is provided', () => {
        individualDetails.correspondenceAddress = validAddress
        expect(validator.validateSync(individualDetails).length).to.equal(0)
      })
    })

    describe('when "has correspondence address" flag is set to false', () => {
      it('should return no errors when correspondence address is not provided', () => {
        individualDetails.address = validAddress
        individualDetails.hasCorrespondenceAddress = false
        individualDetails.name = 'ClaimantName'
        let error = validator.validateSync(individualDetails)
        expect(error.length).to.equal(0)
      })
    })
  })

  describe('deserialize', () => {
    it('should return object initialized with default values when given undefined', () => {
      let deserialized: IndividualDetails = new IndividualDetails().deserialize(undefined)
      expect(deserialized.address).to.be.instanceOf(Address)
      expect(deserialized.hasCorrespondenceAddress).to.equal(false)
      expect(deserialized.correspondenceAddress).to.be.instanceOf(Address)
      expect(deserialized.type).to.equal(PartyType.INDIVIDUAL.value)
      expect(deserialized.name).to.equal(undefined)
      expect(deserialized.dateOfBirth).to.equal(undefined)
    })

    it('should return object with values set from provided input json', () => {
      let deserialized: IndividualDetails = new IndividualDetails().deserialize(input)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.INDIVIDUAL.value)
      expect(deserialized.name).to.equal('claimantName')
      expect(deserialized.dateOfBirth.date.day).to.equal(31)
      expect(deserialized.dateOfBirth.date.month).to.equal(12)
      expect(deserialized.dateOfBirth.date.year).to.equal(2017)
    })
  })

  describe('form object deserialization', () => {
    it('should return undefined when input is undefined', () => {
      expect(IndividualDetails.fromObject(undefined)).to.equal(undefined)
    })

    it('should deserialize all fields', () => {
      let deserialized: IndividualDetails = IndividualDetails.fromObject(formInput)
      expect(deserialized.address.line1).to.equal('first line')
      expect(deserialized.address.postcode).to.equal('bb127nq')
      expect(deserialized.hasCorrespondenceAddress).to.equal(true)
      expect(deserialized.correspondenceAddress.line1).to.equal('another line')
      expect(deserialized.correspondenceAddress.city).to.equal('some city')
      expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq')
      expect(deserialized.type).to.equal(PartyType.INDIVIDUAL.value)
      expect(deserialized.name).to.equal('claimantName')
      expect(deserialized.dateOfBirth.date.day).to.equal(31)
      expect(deserialized.dateOfBirth.date.month).to.equal(12)
      expect(deserialized.dateOfBirth.date.year).to.equal(2017)
    })

    it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
      formInput.hasCorrespondenceAddress = 'false'

      let deserialized: IndividualDetails = IndividualDetails.fromObject(formInput)

      expect(deserialized.correspondenceAddress).to.equal(undefined)
    })
  })

  describe('isCompleted', () => {
    let individualDetails: IndividualDetails

    beforeEach(() => {
      individualDetails = new IndividualDetails()
    })

    it('should return false when address is undefined', () => {
      individualDetails.address = undefined
      expect(individualDetails.isCompleted()).to.equal(false)
    })

    it('should return false when address is not completed', () => {
      individualDetails.address = new Address()
      expect(individualDetails.isCompleted()).to.equal(false)
    })

    it('should return true when address is completed and does not have correspondence address', () => {
      individualDetails.address = validAddress
      individualDetails.hasCorrespondenceAddress = false
      individualDetails.name = 'claimantName'
      individualDetails.dateOfBirth = new DateOfBirth(true, new LocalDate(2007, 1, 1))
      expect(individualDetails.isCompleted()).to.equal(true)
    })

    it('should return false when has correspondence address and correspondence address is undefined', () => {
      individualDetails.address = validAddress
      individualDetails.hasCorrespondenceAddress = true
      individualDetails.correspondenceAddress = undefined
      expect(individualDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has name is undefined', () => {
      individualDetails.address = validAddress
      individualDetails.name = undefined
      individualDetails.dateOfBirth = new DateOfBirth(true, new LocalDate(2007, 1, 1))
      individualDetails.hasCorrespondenceAddress = true
      individualDetails.correspondenceAddress = validAddress
      expect(individualDetails.isCompleted()).to.equal(false)
    })

    it('should return false when has dateOfBirth is undefined', () => {
      individualDetails.address = validAddress
      individualDetails.name = 'claimantName'
      individualDetails.dateOfBirth = undefined
      individualDetails.hasCorrespondenceAddress = true
      individualDetails.correspondenceAddress = validAddress
      expect(individualDetails.isCompleted('claimant')).to.equal(false)
    })

    it('should return false when has correspondence address and correspondence address is not completed', () => {
      individualDetails.address = validAddress
      individualDetails.hasCorrespondenceAddress = true
      individualDetails.correspondenceAddress = new Address()
      expect(individualDetails.isCompleted()).to.equal(false)
    })

    it('should return true when all the required fields are completed', () => {
      individualDetails.address = validAddress
      individualDetails.name = 'claimantName'
      individualDetails.dateOfBirth = new DateOfBirth(true, new LocalDate(2007, 1, 1))
      individualDetails.hasCorrespondenceAddress = true
      individualDetails.correspondenceAddress = validAddress
      expect(individualDetails.isCompleted()).to.equal(true)
    })
  })
})
