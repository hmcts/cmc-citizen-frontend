import { PostcodeInfoClient } from '@hmcts/os-places-client'
import { RequestPromiseOptions } from 'request-promise-native'
import { request } from 'client/request'
import * as config from 'config'

const postcodeLookupApiKey = config.get<string>('postcodeLookup.apiKey')

const requestOptionsOverride = {
  fullResponse: true
} as RequestPromiseOptions

export class ClientFactory {
  static createInstance (): PostcodeInfoClient {
    return new PostcodeInfoClient(
      postcodeLookupApiKey,
      request.defaults(requestOptionsOverride)
    )
  }
}
