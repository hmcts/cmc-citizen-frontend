import { expect } from 'chai'

// import DraftClaim from 'drafts/models/draftClaim'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import InterestDateType from 'app/common/interestDateType'
import InterestDate from 'app/forms/models/interestDate'
import { LocalDate } from 'forms/models/localDate'
import DateOfBirth from 'forms/models/dateOfBirth'
import Reason from 'forms/models/reason'
import { Address } from 'app/forms/models/address'
import { IndividualDetails } from 'forms/models/individualDetails'

const testAddress = {
  line1: 'line1',
  postcode: 'postcode'
} as Address

describe('ClaimModelConverter', () => {
  let draftClaim

  beforeEach(() => {
    draftClaim = {
      interestDate: new InterestDate(InterestDateType.CUSTOM, new LocalDate(2017, 1, 1), 'because'),
      claimant: {
        partyDetails: {
          name: 'John Doe',
          type: 'INDIVIDUAL',
          dateOfBirth: new DateOfBirth(new LocalDate(1982, 1, 1)),
          address: testAddress,
          hasCorrespondenceAddress: true,
          correspondenceAddress: testAddress
        } as IndividualDetails,
        dateOfBirth: new DateOfBirth(new LocalDate(1990, 1, 1))
      },
      defendant: {
        partyDetails: {
          name: 'John Other',
          type: 'INDIVIDUAL',
          dateOfBirth: new DateOfBirth(new LocalDate(1982, 1, 1)),
          address: testAddress,
          hasCorrespondenceAddress: false
        } as IndividualDetails
      },
      reason: new Reason('because')
    }
  })

  describe('when converting claimant details', () => {
    it('should delete the partyDetails property from claimant', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.hasOwnProperty('partyDetails')).to.equal(false)
    })

    it('should set the address on converted object', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.address.line1).to.equal(testAddress.line1)
      expect(converted.claimant.address.line2).to.equal(testAddress.line2)
      expect(converted.claimant.address.city).to.equal(testAddress.city)
      expect(converted.claimant.address.postcode).to.equal(testAddress.postcode)
    })

    it('should set the correspondence address on converted object', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.address.line1).to.equal(testAddress.line1)
      expect(converted.claimant.address.line2).to.equal(testAddress.line2)
      expect(converted.claimant.address.city).to.equal(testAddress.city)
      expect(converted.claimant.address.postcode).to.equal(testAddress.postcode)
    })

    it('should not set the correspondence address if one is not provided', () => {
      draftClaim.claimant.partyDetails.hasCorrespondenceAddress = false
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.hasOwnProperty('correspondenceAddress')).to.equal(false)
    })
  })

  describe('when converting defendant details', () => {
    it('should delete the partyDetails property from defendant', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendant.hasOwnProperty('partyDetails')).to.equal(false)
    })

    it('should set the address on converted object', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendant.address.line1).to.equal('line1')
      expect(converted.defendant.address.postcode).to.equal('postcode')
    })
  })

  describe('when converting names', () => {
    it('should set the name property to a string for claimant', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.name).to.equal('John Doe')
    })

    it('should set the name property to a string for defendant', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendant.name).to.equal('John Other')
    })
  })
})
