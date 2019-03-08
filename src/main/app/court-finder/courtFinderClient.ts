import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { Address } from './address'
import { AreaOfLaw } from './areaOfLaw'
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

  public findCourtByPostcode (postcode: string, areaOfLaw: AreaOfLaw, spoe?: Spoe): Promise<CourtFinderResponse> {
    if (!postcode) {
      return Promise.reject('Missing postcode')
    }
    if (!areaOfLaw) {
      return Promise.reject('Missing area of law')
    }

    let uri: string = `${this.apiUrl}/search/results.json?postcode=${postcode}&aol=${areaOfLaw.name}`
    if (spoe) {
      uri += `&spoe=${spoe}`
    }

    return this.performRequest(uri)
  }

  public findCourtByAddress (address: string): Promise<CourtFinderResponse> {
    if (!address) {
      return Promise.reject('Missing address')
    }

    const uri: string = `${this.apiUrl}/search/results.json?q=${address}`
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
            court.lat,
            court.lon,
            court.number,
            court.cci_code,
            court.magistrate_code,
            court.slug,
            court.types,
            court.dx_number,
            court.distance,
            new Address(
              court.address.address_lines,
              court.address.postcode,
              court.address.town,
              court.address.type),
            court.areas_of_law.map((aol: any) => {
              return new AreaOfLaw(aol.name, aol.external_link, aol.external_link_desc)
            }))
        })
      )
      return courtFinderResponse
    })
  }
}
