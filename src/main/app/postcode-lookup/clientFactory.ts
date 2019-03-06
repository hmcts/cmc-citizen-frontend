import { OSPlacesClient } from '@hmcts/os-places-client'
import { RequestPromiseOptions } from 'request-promise-native'
import { request } from 'client/request'
import * as config from 'config'
import { PostcodeToCountryClient } from '@hmcts/os-names-client'

const postcodeLookupApiKey = config.get<string>('secrets.cmc.os-postcode-lookup-api-key')

const requestOptionsOverride = {
  fullResponse: true
} as RequestPromiseOptions

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
