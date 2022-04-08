import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { Court } from './court'
import { CourtFinderResponse } from './courtFinderResponse'
import * as config from 'config'
import { CourtDetailsResponse } from 'court-finder-client/courtDetailsResponse'
import { CourtDetails } from 'court-finder-client/courtDetails'

export class CourtFinderClient {
  private readonly postCodeSearchUrl
  private readonly nameSearchUrl
  constructor (
    private readonly apiUrl: string = `${config.get<string>('claim-store.url')}`,
    private readonly request: requestDefault.RequestAPI<requestPromise.RequestPromise,
      requestPromise.RequestPromiseOptions,
      requestDefault.RequiredUriUrl> = requestPromise
  ) {
    this.postCodeSearchUrl = `${this.apiUrl}/court-finder/search-postcode/`
    this.nameSearchUrl = `${this.apiUrl}/court-finder/search-name/`
  }

  public findMoneyClaimCourtsByPostcode (postcode: string): Promise<CourtFinderResponse> {
    if (!postcode) {
      return Promise.reject('Missing postcode')
    }

    return this.performRequest(this.postCodeSearchUrl + `${postcode}`)
  }

  public findMoneyClaimCourtsByName (name: string): Promise<CourtFinderResponse> {
    if (!name) {
      return Promise.reject('Missing court name')
    }

    return this.performRequest(this.nameSearchUrl + encodeURIComponent(name))
  }

  public getCourtDetails (slug: string): Promise<CourtDetailsResponse> {
    if (!slug) {
      return Promise.reject('Missing slug')
    }

    const uri = `${this.apiUrl}/court-finder/court-details/${slug}`

    return this.performCourtDetailsRequest(uri)
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
            court.addresses
            )
        }))
      return courtFinderResponse
    })
  }

  private performCourtDetailsRequest (uri: string) {
    return this.request.get({
      json: false,
      resolveWithFullResponse: true,
      simple: false,
      uri: `${uri}`
    }).then((response: any) => {
      if (response.statusCode !== 200) {
        return new CourtDetailsResponse(response.statusCode, false)
      }

      const courtDetailsResponse: CourtDetailsResponse = new CourtDetailsResponse(200, true)
      const responseBody: any = JSON.parse(response.body)

      courtDetailsResponse.courtDetails = new CourtDetails(responseBody.name, responseBody.slug, responseBody.facilities)

      return courtDetailsResponse
    })
  }
}
