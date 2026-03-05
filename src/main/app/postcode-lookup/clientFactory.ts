import { OSPlacesClient } from '@hmcts/os-places-client'
import { request } from 'client/request'
import * as config from 'config'
import { PostcodeToCountryClient } from 'postcode-lookup/postcodeToCountryClient'

const postcodeLookupApiKey = config.get<string>('secrets.cmc.os-postcode-lookup-api-key')

const requestOptionsOverride = { fullResponse: true }

export class ClientFactory {
  static createOSPlacesClient (): OSPlacesClient {
    return new OSPlacesClient(
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
