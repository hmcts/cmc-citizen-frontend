import * as config from 'config'
import * as otp from 'otp'

import { request } from 'client/request'
import { User } from 'idam/user'
import { ServiceAuthToken } from 'idam/serviceAuthToken'
import { AuthToken } from 'idam/authToken'
import { trackCustomEvent } from 'logging/customEventTracker'

const s2sUrl = config.get<string>('idam.service-2-service-auth.url')
const idamApiUrl = config.get<string>('idam.api.url')
const totpSecret = config.get<string>('secrets.cmc.cmc-s2s-secret')
const microserviceName = config.get<string>('idam.service-2-service-auth.microservice')

class ServiceAuthRequest {
  constructor (public microservice: string, public oneTimePassword: string) {
    this.microservice = microservice
    this.oneTimePassword = oneTimePassword
  }
}

export class IdamClient {

  static retrieveServiceToken (): Promise<ServiceAuthToken> {
    const oneTimePassword = otp({ secret: totpSecret }).totp()

    return request.post({
      uri: `${s2sUrl}/lease`,
      body: new ServiceAuthRequest(microserviceName, oneTimePassword)
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
        response.id.toString(),
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
    const clientSecret = config.get<string>('secrets.cmc.citizen-oauth-client-secret')
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
      .catch((error: any) => {
        trackCustomEvent('failed to exchange code',{
          errorValue: {
            message: error.name,
            code: error.statusCode
          }
        })
        throw error
      })
  }

  static invalidateSession (jwt: string, bearerToken: string): Promise<void> {
    if (!jwt) {
      return Promise.reject(new Error('JWT is required'))
    }

    const options = {
      method: 'DELETE',
      uri: `${config.get('idam.api.url')}/session/${jwt}`,
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    }

    request(options)
  }
}
