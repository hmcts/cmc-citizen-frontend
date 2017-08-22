import { expect } from 'chai'

import Claimant from 'drafts/models/claimant'
import { Address } from 'forms/models/address'
import DateOfBirth from 'forms/models/dateOfBirth'
import { MobilePhone } from 'forms/models/mobilePhone'
import DraftClaim from 'drafts/models/draftClaim'
import { Defendant } from 'app/drafts/models/defendant'
import { IndividualDetails } from 'forms/models/individualDetails'

describe('DraftClaim deserialization', () => {
  let input

  beforeEach(() => {
    input = {
      claimant: {
        mobilePhone: {
          number: '7123123123'
        },
        partyDetails: {
          type: 'individual',
          address: {line1: 'Here',line2: 'There',city: 'London',postcode: 'BB12 7NQ'},
          name: 'John Doe',
          dateOfBirth: {
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
    expect(deserialized.claimant.mobilePhone.number).to.equal('7123123123')

    expect(deserialized.defendant.partyDetails.name).to.equal('Janice Henrietta Clark')
    expect(deserialized.defendant.partyDetails.address.line1).to.equal('Another lane')
    expect(deserialized.defendant.partyDetails.address.line2).to.equal(undefined)
    expect(deserialized.defendant.partyDetails.address.city).to.equal('Manchester')
    expect(deserialized.defendant.partyDetails.address.postcode).to.equal('SW8 4DA')
    expect(deserialized.defendant.email.address).to.equal('j.clark@mailserver.com')
  })

  it('should initialize the fields with appropriate class instances', () => {
    let deserialized = new DraftClaim().deserialize(input)

    expect(deserialized.claimant).to.be.instanceof(Claimant)
    expect(deserialized.claimant.partyDetails).to.be.instanceof(IndividualDetails)
    expect(deserialized.claimant.partyDetails.address).to.be.instanceof(Address)
    expect((deserialized.claimant.partyDetails as IndividualDetails).dateOfBirth).to.be.instanceof(DateOfBirth)
    expect(deserialized.claimant.mobilePhone).to.be.instanceof(MobilePhone)
    expect(deserialized.defendant).to.be.instanceof(Defendant)
  })

})
