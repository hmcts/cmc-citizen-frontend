import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import { mockPostcodeLookupResponse } from '../data/entity/mockPostcodeLookupResponse'
import { mockAddressResponse } from '../data/entity/mockAddressResponse'

const mockPostcode = 'https://postcodeinfo.service.justice.gov.uk'

export function resolvePostcodeLookup (): mock.Scope {
  return mock(mockPostcode)
    .get(/\/postcodes\/.+/)
    .reply(HttpStatus.OK, mockPostcodeLookupResponse)
}

export function resolvePostcodeAddressLookup (): mock.Scope {
  return mock(mockPostcode)
    .get(/\/addresses\/\?postcode=.+/)
    .reply(200, mockAddressResponse)
}
