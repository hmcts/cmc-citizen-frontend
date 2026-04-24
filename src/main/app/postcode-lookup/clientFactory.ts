import { request } from 'client/request'
import * as config from 'config'
import { OsPlacesClient } from 'postcode-lookup/osPlacesClient'
import { PostcodeToCountryClient } from 'postcode-lookup/postcodeToCountryClient'

const postcodeLookupApiKey = config.get<string>('secrets.cmc.os-postcode-lookup-api-key')

const requestOptionsOverride = { fullResponse: true }

export class ClientFactory {
  static createOSPlacesClient (): OsPlacesClient {
    return new OsPlacesClient(
      postcodeLookupApiKey,
      request.defaults(requestOptionsOverride)
    )
  }

  static createPostcodeToCountryClient (): PostcodeToCountryClient {
    return new PostcodeToCountryClient(
      postcodeLookupApiKey,
      request.defaults(requestOptionsOverride)
    )
  }
}
