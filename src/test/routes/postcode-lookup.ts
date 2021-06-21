import * as request from 'supertest'
import { expect } from 'chai'
import { app } from 'main/app'
import { Paths } from 'paths'
import 'test/routes/expectations'
import * as mock from 'nock'
import { mockPostcodeLookupResponse } from '../data/entity/mockPostcodeLookupResponse'

describe('PostCode Lookup', () => {

  const mockPostcodeServer = 'https://api.os.uk'
  const mockPostcodePath = /\/search\/places\/v1\/postcode\?.+/

  it('should return correct address when postCode lookup is used', async () => {
    mock(mockPostcodeServer)
      .get(mockPostcodePath)
      .reply(200, mockPostcodeLookupResponse)

    await request(app)
      .get(Paths.postcodeLookupProxy.uri)
      .query({ 'postcode': 'SW2 1AN' })
      .expect(res => expect(res).to.be.successful.withText('DALBERG ROAD'))
  })

  it('should produce appinsights custom event when Ordnance Survey keys stopped working', async () => {

    mock(mockPostcodeServer)
      .get(mockPostcodePath)
      .reply(401, 'Authentication failed')

    await request(app)
      .get(Paths.postcodeLookupProxy.uri)
      .query({ 'postcode': 'SW2 1AN' })
      .expect(res => expect(res).to.serverError.withText('Authentication failed'))
  })
})
