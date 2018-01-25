/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { Country } from 'app/common/country'

describe('Country', () => {
  describe('valueOf', () => {
    it('should return undefined for unknown country', () => {
      expect(Country.valueOf('unknown-country')).to.be.undefined
    })

    it('should return country for known country', () => {
      Country.all().forEach(country => {
        expect(Country.valueOf(country.value)).to.be.equal(country)
      })
    })
  })

  describe('isClaimantCountry', () => {
    it('should return true if country is a valid for a claimant', () => {
      expect(Country.isClaimantCountry(Country.ENGLAND.name)).to.be.true
    })

    it('should return false if country is not valid for a claimant', () => {
      expect(Country.isClaimantCountry('France')).to.be.false
    })

    it('should return true if country is a valid for a defendant', () => {
      expect(Country.isDefendantCountry(Country.ENGLAND.name)).to.be.true
    })

    it('should return false if country is not valid for a defendant', () => {
      expect(Country.isDefendantCountry(Country.SCOTLAND.name)).to.be.false
    })
  })
})
