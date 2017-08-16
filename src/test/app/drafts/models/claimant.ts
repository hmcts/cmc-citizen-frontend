import { expect } from 'chai'

import Claimant from 'drafts/models/claimant'
import { PartyDetails } from 'forms/models/partyDetails'

/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
describe('Claimant', () => {
  describe('constructor', () => {
    it('should have undefined name, dateOfBirth, mobilePhone fields', () => {
      let claimant = new Claimant()
      expect(claimant.name).to.be.undefined
      expect(claimant.dateOfBirth).to.be.undefined
      expect(claimant.mobilePhone).to.be.undefined
    })

    it('should have party details field initialised', () => {
      let claimant = new Claimant()
      expect(claimant.partyDetails).to.be.instanceOf(PartyDetails)
    })
  })

  describe('deserialize', () => {
    it('should return a Claimant instance initialised with defaults for undefined', () => {
      expect(new Claimant().deserialize(undefined)).to.eql(new Claimant())
    })

    it('should return a Claimant instance initialised with defaults for null', () => {
      expect(new Claimant().deserialize(null)).to.eql(new Claimant())
    })
  })
})
