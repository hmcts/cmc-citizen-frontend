import IdamClient from 'idam/idamClient'

import ServiceAuthToken from 'idam/serviceAuthToken'
import { ServiceAuthTokenFactory } from 'modules/draft-store-client/src/main/common/security/serviceTokenFactory'

let token: ServiceAuthToken

export class ServiceAuthTokenFactoryImpl implements ServiceAuthTokenFactory{
  async get (): Promise<ServiceAuthToken> {
    if (token === undefined || token.hasExpired()) {
      token = await IdamClient.retrieveServiceToken()
    }
    return token
  }
}
