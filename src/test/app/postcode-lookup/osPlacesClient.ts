import { expect } from 'chai'
import { OsPlacesClient } from 'postcode-lookup/osPlacesClient'

function mockHttpClient (statusCode: number, body?: any) {
  return {
    get: () => Promise.resolve({ statusCode, body })
  }
}

function failingHttpClient (error: Error) {
  return {
    get: () => Promise.reject(error)
  }
}

describe('OsPlacesClient', () => {

  describe('lookupByPostcodeAndDataSet', () => {

    it('should return addresses for a valid 200 response with DPA results', async () => {
      const body = {
        header: { totalresults: 1 },
        results: [{ DPA: { ADDRESS: '1 HIGH STREET, LONDON', POSTCODE: 'SW1 1AA' } }]
      }
      const client = new OsPlacesClient('key', mockHttpClient(200, body) as any)
      const result = await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')

      expect(result.isValid).to.be.true
      expect(result.addresses).to.have.length(1)
      expect(result.addresses[0].formattedAddress).to.equal('1 HIGH STREET, LONDON')
      expect(result.addresses[0].postcode).to.equal('SW1 1AA')
    })

    it('should return addresses for a valid 200 response with LPI results', async () => {
      const body = {
        header: { totalresults: 1 },
        results: [{ LPI: { ADDRESS: '2 LOW STREET, BRISTOL', POSTCODE_LOCATOR: 'BS1 2AA' } }]
      }
      const client = new OsPlacesClient('key', mockHttpClient(200, body) as any)
      const result = await client.lookupByPostcodeAndDataSet('BS1 2AA', 'DPA,LPI')

      expect(result.isValid).to.be.true
      expect(result.addresses).to.have.length(1)
      expect(result.addresses[0].formattedAddress).to.equal('2 LOW STREET, BRISTOL')
      expect(result.addresses[0].postcode).to.equal('BS1 2AA')
    })

    it('should return isValid false when totalresults is 0', async () => {
      const body = {
        header: { totalresults: 0 },
        results: []
      }
      const client = new OsPlacesClient('key', mockHttpClient(200, body) as any)
      const result = await client.lookupByPostcodeAndDataSet('XX1 1XX', 'DPA,LPI')

      expect(result.isValid).to.be.false
      expect(result.addresses).to.deep.equal([])
    })

    it('should return isValid false when response body has no results array', async () => {
      const body = { header: { totalresults: 0 } }
      const client = new OsPlacesClient('key', mockHttpClient(200, body) as any)
      const result = await client.lookupByPostcodeAndDataSet('XX1 1XX', 'DPA,LPI')

      expect(result.isValid).to.be.false
    })

    it('should return isValid false when response body has no header', async () => {
      const body = { results: [{ DPA: { ADDRESS: 'ADDR', POSTCODE: 'PC' } }] }
      const client = new OsPlacesClient('key', mockHttpClient(200, body) as any)
      const result = await client.lookupByPostcodeAndDataSet('XX1 1XX', 'DPA,LPI')

      expect(result.isValid).to.be.false
    })

    it('should filter out results with no formattedAddress and no postcode', async () => {
      const body = {
        header: { totalresults: 2 },
        results: [
          { DPA: { ADDRESS: 'GOOD ADDRESS', POSTCODE: 'SW1 1AA' } },
          { DPA: {} }
        ]
      }
      const client = new OsPlacesClient('key', mockHttpClient(200, body) as any)
      const result = await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')

      expect(result.addresses).to.have.length(1)
    })

    it('should return empty results for a 404 response', async () => {
      const client = new OsPlacesClient('key', mockHttpClient(404) as any)
      const result = await client.lookupByPostcodeAndDataSet('XX1 1XX', 'DPA,LPI')

      expect(result.isValid).to.be.false
      expect(result.addresses).to.deep.equal([])
    })

    it('should return empty results when body is undefined on 200', async () => {
      const client = new OsPlacesClient('key', mockHttpClient(200, undefined) as any)
      const result = await client.lookupByPostcodeAndDataSet('XX1 1XX', 'DPA,LPI')

      expect(result.isValid).to.be.false
      expect(result.addresses).to.deep.equal([])
    })

    it('should throw for 401 Authentication failed', async () => {
      const client = new OsPlacesClient('key', mockHttpClient(401) as any)
      try {
        await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')
        expect.fail('should have thrown')
      } catch (err) {
        expect(err.message).to.equal('Authentication failed')
      }
    })

    it('should throw for 500 server error', async () => {
      const client = new OsPlacesClient('key', mockHttpClient(500) as any)
      try {
        await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')
        expect.fail('should have thrown')
      } catch (err) {
        expect(err.message).to.equal('Error with OS Places service')
      }
    })

    it('should throw for 503 server error', async () => {
      const client = new OsPlacesClient('key', mockHttpClient(503) as any)
      try {
        await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')
        expect.fail('should have thrown')
      } catch (err) {
        expect(err.message).to.equal('Error with OS Places service')
      }
    })

    it('should return empty results for a network error', async () => {
      const client = new OsPlacesClient('key', failingHttpClient(new Error('ECONNREFUSED')) as any)
      const result = await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')

      expect(result.isValid).to.be.false
      expect(result.addresses).to.deep.equal([])
    })

    it('should encode the postcode in the URL', async () => {
      let capturedUri = ''
      const httpClient = {
        get: (opts: any) => {
          capturedUri = opts.uri
          return Promise.resolve({ statusCode: 200, body: { header: { totalresults: 0 }, results: [] } })
        }
      }
      const client = new OsPlacesClient('mykey', httpClient as any)
      await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')

      expect(capturedUri).to.contain('postcode=SW1%201AA')
      expect(capturedUri).to.contain('key=mykey')
      expect(capturedUri).to.contain('dataset=DPA,LPI')
    })

    it('should handle result with both DPA and LPI preferring DPA', async () => {
      const body = {
        header: { totalresults: 1 },
        results: [{ DPA: { ADDRESS: 'DPA ADDR', POSTCODE: 'DPA PC' }, LPI: { ADDRESS: 'LPI ADDR', POSTCODE_LOCATOR: 'LPI PC' } }]
      }
      const client = new OsPlacesClient('key', mockHttpClient(200, body) as any)
      const result = await client.lookupByPostcodeAndDataSet('SW1 1AA', 'DPA,LPI')

      expect(result.addresses[0].formattedAddress).to.equal('DPA ADDR')
      expect(result.addresses[0].postcode).to.equal('DPA PC')
    })
  })
})
