import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

const baseURL = `${config.get<string>('claim-store.url')}`
const endpointPath = /\/court-finder\/search-postcode\/.+/
const detailEndpointPath = /\/court-finder\/court-details\/.+/
const searchNamePath = /\/court-finder\/search-name\/.+/

export const searchResponse = [
  {
    name: 'Birmingham District Probate Registry',
    lat: 52.4816613587661,
    lon: -1.89552893773996,
    number: null,
    cci_code: null,
    magistrate_code: null,
    slug: 'birmingham-district-probate-registry',
    types: [],
    addresses: [{
      address_lines: [
        'The Priory Courts',
        '33 Bull Street'
      ],
      postcode: 'B4 6DU',
      town: 'Birmingham',
      type: 'Visiting'
    }],
    areas_of_law: [
      {
        name: 'Probate',
        external_link: 'https%3A//www.gov.uk/wills-probate-inheritance',
        external_link_desc: 'Information about wills and probate'
      }
    ],
    displayed: true,
    hide_aols: false,
    dx_number: '701990 Birmingham 7',
    distance: 1
  }
]

export const searchResponseWithNoCourt = [{}]

export const courtDetailsResponse = {
  name: 'Birmingham District Probate Registry',
  slug: 'birmingham-district-probate-registry',
  facilities: []
}

export function resolveFind (): mock.Scope {
  return mock(baseURL)
    .get(endpointPath)
    .reply(HttpStatus.OK, searchResponse)
}

export function resolveCourtDetails (): mock.Scope {
  return mock(baseURL)
    .get(detailEndpointPath)
    .reply(HttpStatus.OK, courtDetailsResponse)
}

export function resolveNameFind (): mock.Scope {
  return mock(baseURL)
    .get(searchNamePath)
    .reply(HttpStatus.OK, searchResponse)
}

export function resolveNameFindWithNoCourt (): mock.Scope {
  return mock(baseURL)
    .get(searchNamePath)
    .reply(HttpStatus.OK, searchResponseWithNoCourt)
}

export function rejectFind (): mock.Scope {
  return mock(baseURL)
    .get(endpointPath)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}

export function rejectName (): mock.Scope {
  return mock(baseURL)
    .get(searchNamePath)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}
