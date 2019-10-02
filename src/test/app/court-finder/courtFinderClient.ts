import * as nock from 'nock'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { CourtFinderClient } from 'court-finder-client/courtFinderClient'
import { CourtFinderResponse } from 'court-finder-client/courtFinderResponse'

const mockClient = 'http://localhost'
const courtFinderClient: CourtFinderClient = new CourtFinderClient(mockClient)

const apiData = [
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
        display_url: '<bound method AreaOfLaw.display_url of <AreaOfLaw: Probate>>',
        external_link_desc: 'Information about wills and probate'
      }
    ],
    displayed: true,
    hide_aols: false,
    dx_number: '701990 Birmingham 7',
    distance: 1,
    facilities: [
      {
        name: 'Interview room',
        description: 'Three interview rooms on upper floor and four in the family suite.'
      }
    ]
  }
]

const expectedResponse = {
  courts: [
    {
      address: {
        addressLines: [
          'The Priory Courts',
          '33 Bull Street'
        ],
        postcode: 'B4 6DU',
        town: 'Birmingham',
        type: 'Visiting'
      },
      name: 'Birmingham District Probate Registry',
      slug: 'birmingham-district-probate-registry'
    }
  ], statusCode: 200, valid: true
}

describe('CourtFinderClient', () => {

  chai.use(chaiAsPromised)

  describe('findMoneyClaimCourtsByPostcode', () => {
    it('should return valid false if no court found', () => {
      nock(mockClient)
          .get(/\/court-finder\/search-postcode\/.+/)
          .reply(404, [])

      return courtFinderClient.findMoneyClaimCourtsByPostcode('A111AA')
          .then((courtResponse: CourtFinderResponse) => {
            chai.expect(courtResponse).eql({ courts: [], statusCode: 404, valid: false })
          })
    })

    it('should return valid false for bad request', () => {
      nock(mockClient)
        .get(/\/court-finder\/search-postcode\/.+/)
        .reply(400, [])

      return courtFinderClient.findMoneyClaimCourtsByPostcode('B222BB')
        .then((courtResponse: CourtFinderResponse) => {
          chai.expect(courtResponse).eql({ courts: [], statusCode: 400, valid: false })
        })
    })

    it('should return found courts', () => {
      nock(mockClient)
          .get(/\/court-finder\/search-postcode\/.+/)
          .reply(200, apiData)
      return courtFinderClient.findMoneyClaimCourtsByPostcode('C333CC')
          .then((courtResponse: CourtFinderResponse) => {
            chai.expect(courtResponse).eql(expectedResponse)
          })
    })

    it('should reject promise if no postcode', () =>
      chai.expect(courtFinderClient.findMoneyClaimCourtsByPostcode('')).rejectedWith('Missing postcode')
    )
  })
})
