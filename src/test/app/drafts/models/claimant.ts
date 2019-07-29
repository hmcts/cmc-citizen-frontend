import { expect } from 'chai'

import { Claimant } from 'drafts/models/claimant'

describe('Claimant', () => {
  describe('deserialize', () => {
    it('should return a Claimant instance initialised with defaults for undefined', () => {
      expect(new Claimant().deserialize(undefined)).to.eql(new Claimant())
    })

    it('should return a Claimant instance initialised with defaults for null', () => {
      expect(new Claimant().deserialize(null)).to.eql(new Claimant())
    })

    it('should try to extract from old mobile field if new phone field is undefined', () => {
      const num = '07123456789'
      const actual = new Claimant().deserialize({ mobilePhone: { number: num } })
      expect(actual.phone.number).to.equal(num)
    })
  })
})
