/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { CheckCountryConstraint } from 'forms/validation/validators/isCountrySupported'
import { Country } from 'common/country'
import { ValidationArguments } from '@hmcts/class-validator'
import * as nock from 'nock'
import { mockPostcodeLookupResponse, mockScottishPostcodeLookupResponse } from 'test/data/entity/mockPostcodeLookupResponse'
import { mockCountryLookupResponse, mockScottishCountryLookupResponse } from 'test/data/entity/mockCountryLookupResponse'

const mockPostcodeServer = 'https://api.ordnancesurvey.co.uk'
const mockPostcodePath = /\/places\/v1\/addresses\/postcode\?.+/

const mockCountryServer = 'https://api.ordnancesurvey.co.uk'
const mockCountryPath = /\/opennames\/v1\/find\?.+/

describe('IsCountrySupported', () => {
  const constraint: CheckCountryConstraint = new CheckCountryConstraint()

  describe('validate', () => {

    context('should return true when ', () => {
      it('given an undefined value', async () => {
        expect(await constraint.validate(undefined)).to.be.true
      })

      it('given a null value', async () => {
        expect(await constraint.validate(null)).to.be.true
      })

      it('given an empty string value', async () => {
        expect(await constraint.validate('')).to.be.true
      })

      it('given an invalid postcode', async () => {
        nock(mockPostcodeServer)
          .get(mockPostcodePath)
          .reply(404)

        expect(await constraint.validate('2SW1AN', validationArgs(Country.all()))).to.be.true
      })

      it('the postcode lookup client returns an error', async () => {
        nock(mockPostcodeServer)
          .get(mockPostcodePath)
          .reply(500)

        expect(await constraint.validate('SW2 1AN', validationArgs(Country.all()))).to.be.true
      })

      it('given a valid postcode', async () => {
        nock(mockPostcodeServer)
          .get(mockPostcodePath)
          .reply(200, mockPostcodeLookupResponse)
        nock(mockCountryServer)
          .get(mockCountryPath)
          .reply(200, mockCountryLookupResponse)

        expect(await constraint.validate('SW21AN', validationArgs(Country.all()))).to.be.true
      })
    })

    context('should return false when ', () => {
      it('given a postcode that is not in the accepted list', async () => {
        nock(mockPostcodeServer)
          .get(mockPostcodePath)
          .reply(200, mockScottishPostcodeLookupResponse)
        nock(mockCountryServer)
          .get(mockCountryPath)
          .reply(200, mockScottishCountryLookupResponse)

        expect(await constraint.validate('EH9 1SH', validationArgs(Country.defendantCountries()))).to.be.false
      })

      it('given an Isle of Man postcode', async () => {
        expect(await constraint.validate('IM99 1AD', validationArgs(Country.defendantCountries()))).to.be.false
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
