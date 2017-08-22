import { expect } from 'chai'
import { Defendant } from 'app/drafts/models/defendant'

/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

describe('Defendant', () => {
  describe('constructor', () => {
    it('should have undefined email', () => {
      const defendant = new Defendant()
      expect(defendant.email).to.be.undefined
    })

    it('should have undefined party details field', () => {
      const defendant = new Defendant()
      expect(defendant.partyDetails).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Defendant instance initialised with defaults for undefined', () => {
      expect(new Defendant().deserialize(undefined)).to.eql(new Defendant())
    })

    it('should a Defendant instance initialised with defaults for null', () => {
      expect(new Defendant().deserialize(null)).to.eql(new Defendant())
    })
  })
})
