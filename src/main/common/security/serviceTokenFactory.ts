import IdamClient from 'idam/idamClient'

import ServiceAuthToken from 'idam/serviceAuthToken'

let token: ServiceAuthToken

export class ServiceAuthTokenFactory {
  static async get (): Promise<ServiceAuthToken> {
    if (token === undefined || token.hasExpired()) {
      token = await IdamClient.retrieveServiceToken()
    }
    return token
  }

}
