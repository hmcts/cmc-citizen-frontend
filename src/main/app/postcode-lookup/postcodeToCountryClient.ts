import { RequestAPI, request } from 'client/request'

export class PostcodeToCountryClient {
  constructor (
    private readonly apiToken: string,
    private readonly request: RequestAPI = request,
    private readonly apiUrl: string = 'https://api.os.uk'
  ) {}

  public async lookupCountry (postcode: string): Promise<string> {
    if (!postcode) {
      return Promise.reject(new Error('Missing required postcode'))
    }

    const uri: string = this.apiUrl + `/search/names/v1/find?query=${postcode}&dataset=DPA,LPI&maxresults=1&key=${this.apiToken}`
    return this.request.get({
      json: true,
      resolveWithFullResponse: true,
      simple: false,
      uri: uri
    })
    .then((response: any) => response.body.results[0]['GAZETTEER_ENTRY']['COUNTRY'])
    .catch(reason => Promise.reject(`Unable to find country for '${postcode}': ${reason}`))
  }
}
