import { ClientFactory } from 'postcode-lookup/clientFactory'
import * as nock from 'nock'
import { expect } from 'chai'
import { mockCountryLookupResponse } from 'test/data/entity/mockCountryLookupResponse'

const countryClient = ClientFactory.createPostcodeToCountryClient()
const mockServer = 'https://api.os.uk'
const mockCountryPath = /\/search\/names\/v1\/find\?.+/

describe('postcodeToCountryClient', () => {

  it('should throw error if no postcode found', async () => {
    nock(mockServer)
      .get(mockCountryPath)
      .reply(404)
    try {
      await countryClient.lookupCountry('XXXX')
    } catch (e) {
      expect(e).to.contain(`Unable to find country for 'XXXX'`)
    }
  })

  it('should return found postcodes', async () => {
    nock(mockServer)
      .get(mockCountryPath)
      .reply(200, mockCountryLookupResponse)

    return countryClient.lookupCountry('SW1H 9AJ')
      .then(country => expect(country).to.equal('England'))
  })

  it('should reject promise if no postcode', async () => {
    try {
      await countryClient.lookupCountry('')
    } catch (e) {
      expect(e.message).to.equal(`Missing required postcode`)
    }
  })
})
