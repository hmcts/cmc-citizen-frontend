import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const baseURL = 'https://courttribunalfinder.service.gov.uk'
const endpointPath = /\/search\/results.json\?postcode=.+&aol=.+&spoe=.+/

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
    address: {
      address_lines: [
        'The Priory Courts',
        '33 Bull Street'
      ],
      postcode: 'B4 6DU',
      town: 'Birmingham',
      type: 'Visiting'
    },
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

export function resolveFind () {
  mock(baseURL)
    .get(endpointPath)
    .reply(HttpStatus.OK, searchResponse)
}

export function rejectFind () {
  mock(baseURL)
    .get(endpointPath)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}
