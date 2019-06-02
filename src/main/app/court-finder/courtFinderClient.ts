import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { Address } from './address'
import { Court } from './court'
import { CourtFinderResponse } from './courtFinderResponse'
import * as config from 'config'

export class CourtFinderClient {
  constructor (
    private readonly apiUrl: string = `${config.get<string>('claim-store.url')}`,
    private readonly request: requestDefault.RequestAPI<requestPromise.RequestPromise,
      requestPromise.RequestPromiseOptions,
      requestDefault.RequiredUriUrl> = requestPromise
  ) {
  }

  public findMoneyClaimCourtsByPostcode (postcode: string): Promise<CourtFinderResponse> {
    if (!postcode) {
      return Promise.reject('Missing postcode')
    }

    let uri: string = `${this.apiUrl}/court-finder/search-postcode/${postcode}`

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
            court.slug,
            new Address(
              court.address.address_lines,
              court.address.postcode,
              court.address.town,
              court.address.type),
            court.facilities
            )
        }))
      return courtFinderResponse
    })
  }
}
