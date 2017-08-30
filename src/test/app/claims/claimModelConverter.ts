import { expect } from 'chai'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import InterestDateType from 'app/common/interestDateType'
import { InterestType } from 'app/forms/models/interest'
import { Defendant } from 'app/drafts/models/defendant'
import Claimant from 'app/drafts/models/claimant'
import DraftClaim from 'app/drafts/models/draftClaim'
import { IndividualDetails } from 'app/forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import Payment from 'app/pay/payment'
import { Address } from 'forms/models/address'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import ClaimAmountBreakdown from 'forms/models/claimAmountBreakdown'
import ClaimAmountRow from 'forms/models/claimAmountRow'
import Interest from 'forms/models/interest'
import InterestDate from 'forms/models/interestDate'
import Reason from 'forms/models/reason'

const testAddress = {
  line1: 'line1',
  postcode: 'postcode'
} as Address

describe('ClaimModelConverter', () => {
  let draftClaim

  beforeEach(() => {
    draftClaim = {
      externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
      readResolveDispute: true,
      readCompletingClaim: true,
      lastUpdateTimestamp: 12345,
      claimant: {
        partyDetails: {
          type: 'individual',
          name: 'John Smith',
          address: testAddress as Address,
          hasCorrespondenceAddress: true,
          correspondenceAddress: testAddress as Address,
          dateOfBirth: new DateOfBirth(new LocalDate(1990, 1, 1)) as DateOfBirth
        } as IndividualDetails,
        mobilePhone: {
          number: '07000000000'
        } as MobilePhone,
        payment: {
          id: '12',
          amount: 2500,
          state: { status: 'success' }
        } as Payment
      } as Claimant,
      defendant: {
        partyDetails: {
          type: 'individual',
          name: 'John Other',
          address: testAddress,
          hasCorrespondenceAddress: false
        } as IndividualDetails,
        email: {address: 'example@example.com' }
      } as Defendant,
      amount: {
        rows: [{
          reason: 'Valid reason',
          amount: 1
        } as ClaimAmountRow
        ]
      } as ClaimAmountBreakdown,
      interest: {
        type: InterestType.NO_INTEREST
      } as Interest,
      interestDate: new InterestDate(InterestDateType.CUSTOM, new LocalDate(2017, 1, 1), 'because') as InterestDate,
      reason: new Reason('because') as Reason
    } as DraftClaim
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
      expect(converted.claimant.name).to.equal('John Smith')
    })

    it('should set the name property to a string for defendant', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendant.name).to.equal('John Other')
    })
  })
})
