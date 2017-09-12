/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import DraftClaim from 'drafts/models/draftClaim'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import InterestDateType from 'app/common/interestDateType'
import InterestDate from 'app/forms/models/interestDate'
import { LocalDate } from 'forms/models/localDate'
import DateOfBirth from 'forms/models/dateOfBirth'
import Reason from 'forms/models/reason'
import { Address } from 'app/forms/models/address'
import { PartyDetails } from 'forms/models/partyDetails'
import Payment from 'app/pay/payment'
import ClaimAmountBreakdown from 'forms/models/claimAmountBreakdown'
import Email from 'forms/models/email'

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
        name: {
          name: 'John Doe'
        },
        mobilePhone: {
          number: '0712313213'
        },
        partyDetails: {
          address: testAddress,
          hasCorrespondenceAddress: true,
          correspondenceAddress: testAddress
        } as PartyDetails,
        dateOfBirth: new DateOfBirth(true, new LocalDate(1990, 1, 1)),
        payment: {
          amount: 10000
        } as Payment
      },
      defendant: {
        name: {
          name: 'John Other'
        },
        partyDetails: {
          address: testAddress,
          hasCorrespondenceAddress: false
        } as PartyDetails,
        email: new Email('j.other@server.net')
      },
      amount: new ClaimAmountBreakdown(),
      reason: new Reason('because')
    } as DraftClaim
  })

  describe('when converting claim details', () => {
    it('should convert interest date into an iso string', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.interestDate.date).to.equal('2017-01-01')
    })

    it('should convert interest date into an iso string', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.interestDate.date).to.equal('2017-01-01')
    })

    it('should flatten the reason', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.reason).to.equal('because')
    })

    it('should set the fee amount in pennies', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.feeAmountInPennies).to.equal(10000)
    })

    it('should move the payment from claimant to claim', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.hasOwnProperty('payment')).to.equal(true)
      expect(converted.claimant.hasOwnProperty('payment')).to.equal(false)
    })

    it('should set the type on amount', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.amount.type).to.equal('breakdown')
    })
  })

  describe('when converting claimant details', () => {
    it('should delete the partyDetails property from claimant', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.hasOwnProperty('partyDetails')).to.equal(false)
    })

    it('should set the address on converted object', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.address).to.deep.equal(testAddress)
    })

    it('should set the correspondence address on converted object', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.correspondenceAddress).to.deep.equal(testAddress)
    })

    it('should not set the correspondence address if one is not provided', () => {
      draftClaim.claimant.partyDetails.hasCorrespondenceAddress = false
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.hasOwnProperty('correspondenceAddress')).to.equal(false)
    })

    it('should should flatten the name property', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.name).to.equal('John Doe')
    })

    it('should should flatten the mobile phone property', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.mobilePhone).to.equal('0712313213')
    })

    it('should should set the type to individual', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.type).to.equal('individual')
    })

    it('should should convert date of birth into an iso string', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.claimant.dateOfBirth).to.equal('1990-01-01')
    })
  })

  describe('when converting defendant details', () => {
    it('should turn defendants into an array', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants).to.be.instanceOf(Array)
    })

    it('should delete defendant property', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.hasOwnProperty('defendant')).to.equal(false)
    })

    it('should delete the partyDetails property from defendant', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].hasOwnProperty('partyDetails')).to.equal(false)
    })

    it('should set the address on converted object', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].address).to.deep.equal(testAddress)
    })

    it('should set the name property to a string', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].name).to.equal('John Other')
    })

    it('should set the type to individual', () => {
      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].type).to.equal('individual')
    })

    it('should flatten non blank email address', () => {
      draftClaim.defendant.email.address = 'j.other@server.net'

      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].email).to.equal('j.other@server.net')
    })

    it('should flatten blank email address', () => {
      draftClaim.defendant.email.address = ''

      let converted = ClaimModelConverter.convert(draftClaim)
      expect(converted.defendants[0].email).to.be.undefined
    })
  })
})
