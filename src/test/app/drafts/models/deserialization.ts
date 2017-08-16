import { expect } from 'chai'

import Claimant from 'drafts/models/claimant'
import { Name } from 'forms/models/name'
import { Address } from 'forms/models/address'
import DateOfBirth from 'forms/models/dateOfBirth'
import { MobilePhone } from 'forms/models/mobilePhone'
import DraftClaim from 'drafts/models/draftClaim'
import { Defendant } from 'app/drafts/models/defendant'

describe('DraftClaim deserialization', () => {
  let input

  beforeEach(() => {
    input = {
      claimant: {
        name: {
          name: 'John Doe'
        },
        partyDetails: {
          address: {
            line1: 'Here',
            line2: 'There',
            city: 'London',
            postcode: 'BB12 7NQ'
          },
          hasCorrespondenceAddress: false
        },
        dateOfBirth: {
          date: {
            day: 10,
            month: 11,
            year: 1990
          }
        },
        mobilePhone: {
          number: '7123123123'
        }
      },
      defendant: {
        name: {
          name: 'Janice Henrietta Clark'
        },
        partyDetails: {
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

    expect(deserialized.claimant.name.name).to.equal('John Doe')
    expect(deserialized.claimant.partyDetails.address.line1).to.equal('Here')
    expect(deserialized.claimant.partyDetails.address.line2).to.equal('There')
    expect(deserialized.claimant.partyDetails.address.city).to.equal('London')
    expect(deserialized.claimant.partyDetails.address.postcode).to.equal('BB12 7NQ')
    expect(deserialized.claimant.dateOfBirth.date.day).to.equal(10)
    expect(deserialized.claimant.dateOfBirth.date.month).to.equal(11)
    expect(deserialized.claimant.dateOfBirth.date.year).to.equal(1990)
    expect(deserialized.claimant.mobilePhone.number).to.equal('7123123123')
    expect(deserialized.defendant.name.name).to.equal('Janice Henrietta Clark')
    expect(deserialized.defendant.partyDetails.address.line1).to.equal('Another lane')
    expect(deserialized.defendant.partyDetails.address.line2).to.equal(undefined)
    expect(deserialized.defendant.partyDetails.address.city).to.equal('Manchester')
    expect(deserialized.defendant.partyDetails.address.postcode).to.equal('SW8 4DA')
    expect(deserialized.defendant.email.address).to.equal('j.clark@mailserver.com')
  })

  it('should initialize the fields with appropriate class instances', () => {
    let deserialized = new DraftClaim().deserialize(input)

    expect(deserialized.claimant).to.be.instanceof(Claimant)
    expect(deserialized.claimant.name).to.be.instanceof(Name)
    expect(deserialized.claimant.partyDetails.address).to.be.instanceof(Address)
    expect(deserialized.claimant.dateOfBirth).to.be.instanceof(DateOfBirth)
    expect(deserialized.claimant.mobilePhone).to.be.instanceof(MobilePhone)
    expect(deserialized.defendant).to.be.instanceof(Defendant)
  })

})
