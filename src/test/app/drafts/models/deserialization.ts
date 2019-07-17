import { Defendant } from 'drafts/models/defendant'
import { expect } from 'chai'
import { ClaimType } from 'eligibility/model/claimType'
import { ClaimValue } from 'eligibility/model/claimValue'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'

import { Claimant } from 'drafts/models/claimant'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Address } from 'forms/models/address'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Phone } from 'forms/models/phone'
import { YesNoOption } from 'models/yesNoOption'

describe('DraftClaim deserialization', () => {
  let input

  beforeEach(() => {
    input = {
      eligibility: true,
      claimant: {
        phone: {
          number: '7123123123'
        },
        partyDetails: {
          type: 'individual',
          address: { line1: 'Here', line2: 'There', city: 'London', postcode: 'BB12 7NQ' },
          name: 'John Doe',
          dateOfBirth: {
            known: 'true',
            date: {
              day: 10,
              month: 11,
              year: 1990
            }
          }
        }
      },
      defendant: {
        partyDetails: {
          type: 'individual',
          name: 'Janice Henrietta Clark',
          address: {
            line1: 'Another lane',
            city: 'Manchester',
            postcode: 'SW8 4DA'
          },
          hasCorrespondenceAddress: false
        },
        email: {
          address: 'j.clark@mailserver.com'
        }
      }
    }
  })

  it('should set the values of the fields to the ones from provided object', () => {
    let deserialized = new DraftClaim().deserialize(input)

    expect(deserialized.claimant.partyDetails.name).to.equal('John Doe')
    expect(deserialized.claimant.partyDetails.address.line1).to.equal('Here')
    expect(deserialized.claimant.partyDetails.address.line2).to.equal('There')
    expect(deserialized.claimant.partyDetails.address.city).to.equal('London')
    expect(deserialized.claimant.partyDetails.address.postcode).to.equal('BB12 7NQ')
    expect((deserialized.claimant.partyDetails as IndividualDetails).dateOfBirth.date.day).to.equal(10)
    expect((deserialized.claimant.partyDetails as IndividualDetails).dateOfBirth.date.month).to.equal(11)
    expect((deserialized.claimant.partyDetails as IndividualDetails).dateOfBirth.date.year).to.equal(1990)
    expect(deserialized.claimant.phone.number).to.equal('7123123123')

    expect(deserialized.defendant.partyDetails.name).to.equal('Janice Henrietta Clark')
    expect(deserialized.defendant.partyDetails.address.line1).to.equal('Another lane')
    expect(deserialized.defendant.partyDetails.address.line2).to.equal(undefined)
    expect(deserialized.defendant.partyDetails.address.city).to.equal('Manchester')
    expect(deserialized.defendant.partyDetails.address.postcode).to.equal('SW8 4DA')
    expect(deserialized.defendant.email.address).to.equal('j.clark@mailserver.com')

    expect(deserialized.eligibility).to.equal(true)
  })

  it('should initialize the fields with appropriate class instances', () => {
    let deserialized = new DraftClaim().deserialize(input)

    expect(deserialized.claimant).to.be.instanceof(Claimant)
    expect(deserialized.claimant.partyDetails).to.be.instanceof(IndividualDetails)
    expect(deserialized.claimant.partyDetails.address).to.be.instanceof(Address)
    expect((deserialized.claimant.partyDetails as IndividualDetails).dateOfBirth).to.be.instanceof(DateOfBirth)
    expect(deserialized.claimant.phone).to.be.instanceof(Phone)
    expect(deserialized.defendant).to.be.instanceof(Defendant)
  })

  it('should convert legacy eligibility object into boolean value', () => {
    let deserialized = new DraftClaim().deserialize({
      ...input,
      ...{
        eligibility: {
          claimValue: {
            option: ClaimValue.UNDER_10000.option
          },
          helpWithFees: {
            option: YesNoOption.NO.option
          },
          claimantAddress: {
            option: YesNoOption.YES.option
          },
          defendantAddress: {
            option: YesNoOption.YES.option
          },
          eighteenOrOver: {
            option: YesNoOption.YES.option
          },
          defendantAge: {
            option: DefendantAgeOption.YES.option
          },
          claimType: {
            option: ClaimType.PERSONAL_CLAIM.option
          },
          singleDefendant: {
            option: YesNoOption.NO.option
          },
          governmentDepartment: {
            option: YesNoOption.NO.option
          },
          claimIsForTenancyDeposit: {
            option: YesNoOption.NO.option
          }
        }
      }
    })
    expect(deserialized.eligibility).to.equal(true)
  })

})
