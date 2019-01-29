import { expect } from 'chai'
import { CheckCountryConstraint } from 'forms/validation/validators/isCountrySupported'
import { Country } from 'common/country'
import { ValidationArguments } from '@hmcts/class-validator'
import * as nock from 'nock'
import { mockAddressResponse } from 'test/data/entity/mockAddressResponse'
import { mockPostcodeLookupResponse, mockScottishPostcodeLookupResponse } from 'test/data/entity/mockPostcodeLookupResponse'

const mockPostcode = 'https://postcodeinfo.service.justice.gov.uk'

describe('IsCountrySupported', () => {
  const constraint: CheckCountryConstraint = new CheckCountryConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given an undefined value', async () => {
        expect(await constraint.validate(undefined)).to.equal(true)
      })

      it('given a null value', async () => {
        expect(await constraint.validate(null)).to.equal(true)
      })

      it('given an empty string value', async () => {
        expect(await constraint.validate('')).to.equal(true)
      })

      it('given an invalid postcode', async () => {
        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(404)
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(404)

        expect(await constraint.validate('2SW1AN', validationArgs(Country.all()))).to.equal(true)
      })

      it('the postcode lookup client returns an error', async () => {
        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(500)
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(500)

        expect(await constraint.validate('SW2 1AN', validationArgs(Country.all()))).to.equal(true)
      })

      it('given a valid postcode', async () => {
        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(200, mockPostcodeLookupResponse)
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(200, mockAddressResponse)

        expect(await constraint.validate('SW21AN', validationArgs(Country.all()))).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given a postcode that is not in the accepted list', async () => {
        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(200, mockScottishPostcodeLookupResponse)
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(200, [])

        expect(await constraint.validate('EH9 1SH', validationArgs(Country.defendantCountries()))).to.equal(false)
      })

      it('given an Isle of Man postcode', async () => {
        expect(await constraint.validate('IM99 1AD', validationArgs(Country.defendantCountries()))).to.equal(false)
      })
    })
  })
})

function validationArgs (countries: Country[]): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: undefined,
    property: undefined,
    constraints: [countries]
  }
}
