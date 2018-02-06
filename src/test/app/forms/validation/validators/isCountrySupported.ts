import { expect } from 'chai'
import { CheckCountryConstraint } from 'forms/validation/validators/isCountrySupported'
import { Country } from 'app/common/country'
import { ValidationArguments } from 'class-validator'
import * as nock from 'nock'
import { mockAddressResponse } from '../../../../data/entity/mockAddressResponse'
import { mockPostcodeLookupResponse, mockInvalidPostcodeLookupResponse, mockScottishPostcodeLookupResponse } from '../../../../data/entity/mockPostcodeLookupResponse'

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

      it('given a valid postcode', async () => {
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(200, mockAddressResponse)

        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(200, mockPostcodeLookupResponse)
        expect(await constraint.validate('SW21AN', validationArgs(Country.all()))).to.equal(true)
      })

      it('given a valid postcode that the postcode lookup service can not find', async () => {
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(200, [])

        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(200, mockInvalidPostcodeLookupResponse)
        expect(await constraint.validate('SA6 7JL', validationArgs(Country.all()))).to.equal(true)
      })

      it('given an invalid postcode', async () => {
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(200, [])

        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(200, mockInvalidPostcodeLookupResponse)
        expect(await constraint.validate('2SW1AN', validationArgs(Country.all()))).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given a postcode that is not in the accepted list', async () => {
        nock(mockPostcode)
          .get(/\/addresses\/\?postcode=.+/)
          .reply(200, [])

        nock(mockPostcode)
          .get(/\/postcodes\/.+/)
          .reply(200, mockScottishPostcodeLookupResponse)
        expect(await constraint.validate('EH9 1SH', validationArgs(Country.defendantCountries()))).to.equal(false)
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
