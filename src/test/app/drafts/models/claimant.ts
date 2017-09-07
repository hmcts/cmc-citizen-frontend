import { expect } from 'chai'

import Claimant from 'drafts/models/claimant'

/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
describe('Claimant', () => {
  describe('deserialize', () => {
    it('should return a Claimant instance initialised with defaults for undefined', () => {
      expect(new Claimant().deserialize(undefined)).to.eql(new Claimant())
    })

    it('should return a Claimant instance initialised with defaults for null', () => {
      expect(new Claimant().deserialize(null)).to.eql(new Claimant())
    })
  })
})
