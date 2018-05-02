/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { PartyType } from 'common/partyType'

describe('PartyType', () => {
  describe('valueOf', () => {
    it('should return undefined for unknown type', () => {
      expect(PartyType.valueOf('unknown-type')).to.be.undefined
    })

    it('should return type for known types', () => {
      PartyType.all().forEach(type => {
        expect(PartyType.valueOf(type.value)).to.be.equal(type)
      })
    })
  })
})
