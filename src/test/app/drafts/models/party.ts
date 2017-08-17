import { expect } from 'chai'

import Party from 'drafts/models/party'
import { Address } from 'forms/models/address'

describe('Party', () => {
  describe('constructor', () => {
    it('should have instance fields initialised', () => {
      let party = new Party()
      expect(party.address).to.be.instanceof(Address)
      expect(party.correspondenceAddress).to.be.instanceof(Address)
      expect(party.type).to.be.eq(undefined)
    })
  })

  describe('deserialize', () => {
    it('should return a party instance initialised with defaults for undefined', () => {
      expect(new Party().deserialize(undefined)).to.eql(new Party())
    })

    it('should a party instance initialised with defaults for null', () => {
      expect(new Party().deserialize(null)).to.eql(new Party())
    })
  })
})
