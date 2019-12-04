import * as request from 'supertest'
import { expect } from 'chai'
import { app } from 'main/app'
import { Paths } from 'paths'
import 'test/routes/expectations'
import * as mock from 'nock'
import { mockPostcodeLookupResponse } from '../data/entity/mockPostcodeLookupResponse'

describe('PostCode Lookup', () => {

  const mockPostcodeServer = 'https://api.ordnancesurvey.co.uk'
  const mockPostcodePath = /\/places\/v1\/addresses\/postcode\?.+/

  it('should return correct address when postCode lookup ', async () => {
    mock(mockPostcodeServer)
      .get(mockPostcodePath)
      .reply(200, mockPostcodeLookupResponse)

    await request(app)
      .get(Paths.postcodeLookupProxy.uri)
      .query({ 'postcode': 'SW19 1AA' })
      .expect(res => expect(res).to.be.successful.withText('SW2 1AN'))
  })

  it('should produce appinsights custom event when postCode lookup key does not work', async () => {

    mock(mockPostcodeServer)
      .get(mockPostcodePath)
      .reply(200, Promise.reject('asdfaf'))

    await request(app)
      .get(Paths.postcodeLookupProxy.uri)
      .query({ 'postcode': 'drery' })
      .expect(res => expect(res).to.serverError.withText('Authentication failed'))
  })
})
