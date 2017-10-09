import * as config from 'config'
import * as otp from 'otp'

import request from 'client/request'
import User from 'app/idam/user'
import ServiceAuthToken from 'idam/serviceAuthToken'
import { AuthToken } from 'idam/authToken'

const s2sUrl = config.get<string>('idam.service-2-service-auth.url')
const idamApiUrl = config.get<string>('idam.api.url')
const totpSecret = config.get<string>('idam.service-2-service-auth.totpSecret')
const microserviceName = config.get<string>('idam.service-2-service-auth.microservice')

class ServiceAuthRequest {
  constructor (public microservice: string, public oneTimePassword: string) {
    this.microservice = microservice
    this.oneTimePassword = oneTimePassword
  }
}

export default class IdamClient {

  static retrieveServiceToken (): Promise<ServiceAuthToken> {
    const oneTimePassword = otp({ secret: totpSecret }).totp()

    return request.post({
      uri: `${s2sUrl}/lease`,
      form: new ServiceAuthRequest(microserviceName, oneTimePassword),
      json: false
    }).then(token => {
      return new ServiceAuthToken(token)
    })
  }

  static retrieveUserFor (jwt: string): Promise<User> {
    return request.get({
      uri: `${idamApiUrl}/details`,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).then((response: any) => {
      return new User(
        response.id,
        response.email,
        response.forename,
        response.surname,
        response.roles,
        response.group,
        jwt
      )
    })
  }

  static exchangeCode (code: string, redirectUri: string): Promise<AuthToken> {
    const clientId = config.get<string>('oauth.clientId')
    const clientSecret = config.get<string>('oauth.clientSecret')
    const url = `${config.get('idam.api.url')}/oauth2/token`

    return request.post({
      uri: url,
      auth: {
        username: clientId,
        password: clientSecret
      },
      form: { grant_type: 'authorization_code', code: code, redirect_uri: redirectUri }
    })
      .then((response: any) => {
        return new AuthToken(
          response.access_token,
          response.token_type,
          response.expires_in
        )
      })
  }
}
