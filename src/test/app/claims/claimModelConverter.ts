import { expect } from 'chai'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import InterestDateType from 'app/common/interestDateType'
import { InterestType } from 'app/forms/models/interest'
import { Defendant } from 'app/drafts/models/defendant'
import Claimant from 'app/drafts/models/claimant'
import DraftClaim from 'app/drafts/models/draftClaim'
import { IndividualDetails } from 'app/forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import { Address } from 'forms/models/address'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import ClaimAmountRow from 'forms/models/claimAmountRow'
import Interest from 'forms/models/interest'
import InterestDate from 'forms/models/interestDate'
import Reason from 'forms/models/reason'
import Payment from 'app/pay/payment'
import ClaimAmountBreakdown from 'forms/models/claimAmountBreakdown'
import Email from 'forms/models/email'
import { Individual } from 'claims/models/details/yours/individual'

const testAddress = {
  line1: 'line1',
  line2: undefined,
  city: 'a city',
  postcode: 'postcode'
}

describe('ClaimModelConverter', () => {
  let draftClaim

  beforeEach(() => {
    draftClaim = {
      externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
      readResolveDispute: true,
      readCompletingClaim: true,
      lastUpdateTimestamp: 12345,
      claimant: {
        payment: {
          id: '12',
          amount: 10000,
          state: { status: 'success' }
        } as Payment,
        partyDetails: {
          type: 'individual',
          name: 'John Doe',
          address: testAddress as Address,
          hasCorrespondenceAddress: true,
          correspondenceAddress: testAddress as Address,
          dateOfBirth: new DateOfBirth(true, new LocalDate(1990, 1, 1))
        } as IndividualDetails,
        mobilePhone: {
          number: '0712313213'
        } as MobilePhone
      } as Claimant,
      defendant: {
        partyDetails: {
          type: 'individual',
          name: 'John Other',
          address: testAddress,
          hasCorrespondenceAddress: false
        } as IndividualDetails,
        email: { address: 'example@example.com' }
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
      reason: new Reason('because') as Reason,
      email: new Email('j.other@server.net'),
      deserialize: () => this
    } as DraftClaim
  })

  describe('when converting claim details', () => {
    it('should convert interest date into a moment', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.interestDate.date.toISOString()).to.equal('2017-01-01T00:00:00.000Z')
    })

    it('should flatten the reason', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.reason).to.equal('because')
    })

    it('should set the fee amount in pennies', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.feeAmountInPennies).to.equal(10000)
    })

    it('should move the payment from claimant to claim', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.hasOwnProperty('payment')).to.equal(true)
      expect(converted.claimant.hasOwnProperty('payment')).to.equal(false)
    })

    it('should set the type on amount', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.amount.type).to.equal('breakdown')
    })
  })

  describe('when converting claimant details', () => {
    it('should delete the partyDetails property from claimant', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.hasOwnProperty('partyDetails')).to.equal(false)
    })

    it('should set the address on converted object', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.address.line1).to.equal(testAddress.line1)
      expect(converted.claimant.address.line2).to.equal(testAddress.line2)
      expect(converted.claimant.address.city).to.equal(testAddress.city)
      expect(converted.claimant.address.postcode).to.equal(testAddress.postcode)
    })

    it('should set the correspondence address on converted object', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.address.line1).to.equal(testAddress.line1)
      expect(converted.claimant.address.line2).to.equal(testAddress.line2)
      expect(converted.claimant.address.city).to.equal(testAddress.city)
      expect(converted.claimant.address.postcode).to.equal(testAddress.postcode)
    })

    it('should not set the correspondence address if one is not provided', () => {
      draftClaim.claimant.partyDetails.hasCorrespondenceAddress = false
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.hasOwnProperty('correspondenceAddress')).to.equal(false)
    })

    it('should should flatten the name property', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.name).to.equal('John Doe')
    })

    it('should should flatten the mobile phone property', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.mobilePhone).to.equal('0712313213')
    })

    it('should should set the type to individual', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.type).to.equal('individual')
    })

    it('should should convert date of birth into an iso string', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect((converted.claimant as Individual).dateOfBirth).to.equal('1990-01-01')
    })
  })

  describe('when converting defendant details', () => {
    it('should turn defendants into an array', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants).to.be.instanceOf(Array)
    })

    it('should delete defendant property', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.hasOwnProperty('defendant')).to.equal(false)
    })

    it('should delete the partyDetails property from defendant', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].hasOwnProperty('partyDetails')).to.equal(false)
    })

    it('should set the address on converted object', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].address.line1).to.equal(testAddress.line1)
      expect(converted.defendants[0].address.line2).to.equal(testAddress.line2)
      expect(converted.defendants[0].address.city).to.equal(testAddress.city)
      expect(converted.defendants[0].address.postcode).to.equal(testAddress.postcode)
    })

    it('should set the name property to a string', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.name).to.equal('John Doe')
      expect(converted.defendants[0].name).to.equal('John Other')
    })

    it('should set the type to individual', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].type).to.equal('individual')
    })

    it('should flatten the email address', () => {
      const converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].email).to.equal('example@example.com')
    })
  })
})
