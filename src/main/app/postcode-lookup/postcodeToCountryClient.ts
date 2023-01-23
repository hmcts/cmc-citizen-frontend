import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'

export class PostcodeToCountryClient {
  constructor (
    private readonly apiToken: string,
    private readonly request: requestDefault.RequestAPI<requestPromise.RequestPromise,
        requestPromise.RequestPromiseOptions,
        requestDefault.RequiredUriUrl> = requestPromise,
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
    .then((response) => response.body.results[0]['GAZETTEER_ENTRY']['COUNTRY'])
    .catch(reason => Promise.reject(`Unable to find country for '${postcode}': ${reason}`))
  }
}
