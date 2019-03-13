import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { Address } from './address'
import { Court } from './court'
import { CourtFinderResponse } from './courtFinderResponse'
import { Spoe } from './spoe'

export class CourtFinderClient {
  constructor (
    private readonly apiUrl: string = 'https://courttribunalfinder.service.gov.uk',
    private readonly request: requestDefault.RequestAPI<requestPromise.RequestPromise,
      requestPromise.RequestPromiseOptions,
      requestDefault.RequiredUriUrl> = requestPromise
  ) {
  }

  public findMoneyClaimCourtsByPostcode (postcode: string, spoe: Spoe = Spoe.NEAREST): Promise<CourtFinderResponse> {
    if (!postcode) {
      return Promise.reject('Missing postcode')
    }

    let uri: string = `${this.apiUrl}/search/results.json?postcode=${postcode}&aol=Money claims&spoe=${spoe.name}`

    return this.performRequest(uri)
  }

  private performRequest (uri: string): Promise<CourtFinderResponse> {
    return this.request.get({
      json: false,
      resolveWithFullResponse: true,
      simple: false,
      uri: `${uri}`
    }).then((response: any) => {
      if (response.statusCode !== 200) {
        return new CourtFinderResponse(response.statusCode, false)
      }

      const courtFinderResponse: CourtFinderResponse = new CourtFinderResponse(200, true)
      const responseBody: any[] = JSON.parse(response.body)

      courtFinderResponse.addAll(
        responseBody.map((court: any) => {
          return new Court(
            court.name,
            court.distance,
            new Address(
              court.address.address_lines,
              court.address.postcode,
              court.address.town,
              court.address.type))
        }))
      return courtFinderResponse
    })
  }
}
