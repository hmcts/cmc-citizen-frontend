import { request } from 'integration-test/helpers/clients/base/request'
import * as url from 'url'
import * as urlencode from 'urlencode'

import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('bootstrap')

const baseURL: string = process.env.IDAM_URL

const defaultPassword = 'Password12'

const oauth2 = {
  client_id: 'cmc_citizen',
  redirect_uri: `${process.env.CITIZEN_APP_URL}/receiver`,
  client_secret: process.env.OAUTH_CLIENT_SECRET
}

const strategicIdam: boolean = baseURL.includes('core-compute') ||
  baseURL.includes('platform.hmcts.net')

export class IdamClient {

  /**
   * Creates user with default password
   *
   * @param {string} email
   * @param {string} userGroupCode
   * @param password the user's password, will use a default if undefined
   * @returns {Promise<void>}
   */
  static createUser (email: string, userGroupCode: string, password: string = undefined): Promise<void> {
    return request.post({
      uri: `${baseURL}/testing-support/accounts`,
      body: {
        email: email,
        forename: 'John',
        surname: 'Smith',
        levelOfAccess: 0,
        userGroup: {
          code: userGroupCode
        },
        activationDate: '',
        lastAccess: '',
        password: password ? password : defaultPassword
      }
    })
  }

  /**
   * Authenticate user
   *
   * @param {string} username the username to authenticate
   * @param password the users password (optional, default will be used if none provided)
   * @returns {Promise<string>} the users access token
   */
  static async authenticateUser (username: string, password: string = undefined): Promise<string> {

    const base64Authorisation: string = IdamClient.toBase64(`${username}:${password || defaultPassword}`)
    const oauth2Params: string = IdamClient.toUrlParams(oauth2)

    logger.info('Calling: ' + `${baseURL}/oauth2/authorize?response_type=code&${oauth2Params}`)

    const authResponse = await request.post({
      url: `${baseURL}/oauth2/authorize?response_type=code&${oauth2Params}`,
      headers: {
        Authorization: `Basic ${base64Authorisation}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    logger.info(authResponse)
    logger.info(authResponse['status'] + ' ::: ' + authResponse['body'])

    return IdamClient.exchangeCode(authResponse['code'])
  }

  static getPin (letterHolderId: string) {
    return request.get({
      uri: `${baseURL}/testing-support/accounts/pin/${letterHolderId}`,
      resolveWithFullResponse: true,
      rejectUnauthorized: false,
      json: false
    })
  }

  /**
   * Uplift's a users account
   *
   * @param {string} email
   * @param upliftToken the pin user's authorization header
   * @returns {Promise<string>}
   */
  static async upliftUser (email: string, upliftToken: string): Promise<void> {
    if (strategicIdam) {
      const upliftParams = IdamClient.toUrlParams({
        userName: email,
        password: defaultPassword,
        jwt: upliftToken,
        clientId: oauth2.client_id,
        redirectUri: oauth2.redirect_uri
      })

      const res = await require('request-promise-native').post({
        uri: `${baseURL}/login/uplift?${upliftParams}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        simple: false,
        followRedirect: false,
        json: false,
        resolveWithFullResponse: true
      })

      const code: string = url.parse(res.headers.location, true).query.code.toString()
      await IdamClient.exchangeCode(code)
    } else {
      const base64EncodedCredentials = IdamClient.toBase64(`${email}:${defaultPassword}`)
      const upliftParams = IdamClient.toUrlParams({
        response_type: 'code',
        client_id: oauth2.client_id,
        redirect_uri: oauth2.redirect_uri,
        upliftToken: upliftToken
      })

      await request.post({
        uri: `${baseURL}/oauth2/authorize?${upliftParams}`,
        headers: {
          Authorization: `Basic ${base64EncodedCredentials}`
        }
      })
    }

  }

  /**
   * Authorizes pin user
   *
   * @param {string} pin
   * @returns {Promise<string>} bearer token
   */
  static async authenticatePinUser (pin: string): Promise<string> {
    const oauth2Params: string = IdamClient.toUrlParams(oauth2)
    let code
    if (strategicIdam) {
      const res = await request.get({
        uri: `${baseURL}/pin?${oauth2Params}`,
        headers: {
          pin,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        simple: false,
        followRedirect: false,
        json: false,
        resolveWithFullResponse: true
      })

      code = url.parse(res.headers.location, true).query.code
    } else {
      const base64EncodedCredentials = IdamClient.toBase64(pin)

      code = (await request.post({
        uri: `${baseURL}/oauth2/authorize?${oauth2Params}&response_type=code`,
        headers: {
          Authorization: `Pin ${base64EncodedCredentials}`
        }
      })).code
    }

    return IdamClient.exchangeCode(code)
  }

  static exchangeCode (code: string): Promise<string> {

    return request.post({
      uri: `${baseURL}/oauth2/token`,
      auth: {
        username: oauth2.client_id,
        password: oauth2.client_secret
      },
      form: { grant_type: 'authorization_code', code: code, redirect_uri: oauth2.redirect_uri }
    })
      .then((response: any) => {
        return response['access_token']
      })
  }

  /**
   * Retrieves uses details
   *
   * @param {string} jwt
   * @returns {Promise<User>}
   */
  static retrieveUser (jwt: string): Promise<User> {
    return request.get({
      uri: `${baseURL}/details`,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
  }

  private static toBase64 (value: string): string {
    return Buffer.from(value).toString('base64')
  }

  private static toUrlParams (value: object): string {
    return Object.entries(value).map(([key, val]) => `${key}=${urlencode(val)}`).join('&')
  }
}
