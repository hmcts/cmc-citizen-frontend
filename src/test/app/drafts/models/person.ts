import { expect } from 'chai'

import Person from 'drafts/models/person'
import { PartyDetails } from 'forms/models/partyDetails'

/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
describe('Person', () => {
  describe('constructor', () => {
    it('should have undefined name field', () => {
      let person = new Person()
      expect(person.name).to.be.undefined
    })

    it('should have initialised party details field', () => {
      let person = new Person()
      expect(person.partyDetails).to.be.instanceOf(PartyDetails)
    })
  })

  describe('deserialize', () => {
    it('should return a Person instance initialised with defaults for undefined', () => {
      expect(new Person().deserialize(undefined)).to.eql(new Person())
    })

    it('should a Person instance initialised with defaults for null', () => {
      expect(new Person().deserialize(null)).to.eql(new Person())
    })
  })
})
