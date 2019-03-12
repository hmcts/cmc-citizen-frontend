import * as fs from 'fs'
import * as nock from 'nock'
import * as path from 'path'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { CourtFinderClient } from 'court-finder-client/courtFinderClient'
import { CourtFinderResponse } from 'court-finder-client/courtFinderResponse'

const mockClient = 'http://localhost'
const courtFinderClient: CourtFinderClient = new CourtFinderClient(mockClient)

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
      distance: 1,
      name: 'Birmingham District Probate Registry'
    }
  ], statusCode: 200, valid: true
}

describe('CourtFinderClient', () => {

  chai.use(chaiAsPromised)

  describe('findMoneyClaimCourtsByPostcode', () => {
    it('should return valid false if no court found', () => {
      nock(mockClient)
          .get(/\/search\/results.json\?postcode=.+&aol=.+/)
          .reply(404, [])

      return courtFinderClient.findMoneyClaimCourtsByPostcode('A111AA')
          .then((courtResponse: CourtFinderResponse) => {
            chai.expect(courtResponse).eql({ courts: [], statusCode: 404, valid: false })
          })
    })

    it('should return found courts', () => {
      nock(mockClient)
          .get(/\/search\/results.json\?postcode=.+&aol=.+/)
          .reply(200, fs.readFileSync(path.join(__dirname, 'courtFinderClientAll.json')))
      return courtFinderClient.findMoneyClaimCourtsByPostcode('A111AA')
          .then((courtResponse: CourtFinderResponse) => {
            chai.expect(courtResponse).eql(expectedResponse)
          })
    })

    it('should reject promise if no postcode', () =>
      chai.expect(courtFinderClient.findMoneyClaimCourtsByPostcode('')).rejectedWith('Missing postcode')
    )
  })
})
