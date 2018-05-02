/* tslint:disable:no-unused-expression */

import * as chai from 'chai'

import { Country } from 'common/country'

describe('Country', () => {
  describe('valueOf', () => {
    it('should return undefined for unknown country', () => {
      chai.expect(Country.valueOf('unknown-country')).to.be.undefined
    })

    it('should return country for known country', () => {
      Country.all().forEach(country => {
        chai.expect(Country.valueOf(country.value)).to.be.equal(country)
      })
    })
  })
})
