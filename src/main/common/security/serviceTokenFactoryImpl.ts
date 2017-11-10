import { IdamClient } from 'idam/idamClient'

import { ServiceAuthToken } from 'idam/serviceAuthToken'
import { ServiceAuthTokenFactory } from '@hmcts/draft-store-client'

let token: ServiceAuthToken

export class ServiceAuthTokenFactoryImpl implements ServiceAuthTokenFactory {
  async get (): Promise<ServiceAuthToken> {
    if (token === undefined || token.hasExpired()) {
      token = await IdamClient.retrieveServiceToken()
    }
    return token
  }
}
