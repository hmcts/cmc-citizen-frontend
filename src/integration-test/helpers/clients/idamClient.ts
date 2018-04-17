import { request } from 'integration-test/helpers/clients/base/request'

const baseURL: string = process.env.IDAM_URL

const defaultPassword = 'Password12'

export class IdamClient {

  /**
   * Creates user with default password
   *
   * @param {string} email
   * @param {string} userGroupCode
   * @returns {Promise<void>}
   */
  static createUser (email: string, userGroupCode: string, password: string = undefined): Promise<void> {
    return request.post({
      uri: `${baseURL}/testing-support/accounts`,
      body: {
        email: email,
        forename: 'John',
        surname: 'Smith',
        levelOfAccess: 1,
        userGroup: {
          code: userGroupCode
        },
        activationDate: '',
        lastAccess: '',
        password: password ? password : defaultPassword
      }
    }).catch(o => {
      console.log(o)
    })
  }

  static async authenticateUser (username: string, password: string = undefined): Promise<string> {

    password = password || defaultPassword

    const base64Authorisation: string = IdamClient.toBase64(`${username}:${password}`)

    const oauth2 = {
      client_id: 'cmc_citizen',
      redirect_uri: 'https://localhost:3000/receiver'
    }

    console.log('I am here 4', oauth2.redirect_uri, {
      response_type: 'code',
      client_id: oauth2.client_id,
      redirect_uri: oauth2.redirect_uri
    }, `${baseURL}/oauth2/authorize`)


    const oauth2Params = Object.entries(oauth2).map(([key, val]) => `${key}=${val}`).join('&')

    console.log(`${baseURL}/oauth2/authorize?${oauth2Params}`)

    const authResponse = await request.post({
      url: `${baseURL}/oauth2/authorize?response_type=code&${oauth2Params}`,
      headers: { Authorization: `Basic ${base64Authorisation}` }
    }).catch(o => {
      console.log(o)
    })

    console.log('I am here 5', authResponse)

    const tokenParams = Object.entries({
      code: authResponse['code'],
      grant_type: 'authorization_code',
      client_id: oauth2.client_id,
      redirect_uri: oauth2.redirect_uri,
      client_secret: '123456'
    }).map(([key, val]) => `${key}=${val}`).join('&')


    const tokenExchangeResponse = await request.post({
      url: `${baseURL}/oauth2/token?${tokenParams}`,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }).catch(o => {
      console.log(username, o)
    })

    console.log('I am here 6', tokenExchangeResponse)

    return tokenExchangeResponse['access_token']
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
  static async upliftUser (email: string, upliftToken: string): Promise<string> {
    const base64EncodedCredentials = new Buffer(`${email}:${defaultPassword}`)
      .toString('base64')

    const { 'access-token': token } = await request.post({
      uri: `${baseURL}/oauth2/authorize?upliftToken=${upliftToken}`,
      headers: {
        Authorization: `Basic ${base64EncodedCredentials}`
      }
    })

    return token
  }

  /**
   * Authorizes pin user
   *
   * @param {string} pin
   * @returns {Promise<string>} bearer token
   */
  static async authenticatePinUser (pin: string): Promise<string> {
    const base64EncodedCredentials = IdamClient.toBase64(pin)

    console.log('PIN:', base64EncodedCredentials)

    const { 'access_token': token } = await request.post({
      uri: `${baseURL}/oauth2/authorize`,
      headers: {
        Authorization: `Pin ${base64EncodedCredentials}`
      }
    })

    return token
  }

  // /**
  //  * Authenticate user
  //  *
  //  * @param {string} email
  //  * @param password the users password (optional, default will be used if none provided)
  //  * @returns {Promise<string>}
  //  */
  // static async authenticateUser (email: string, password: string = undefined): Promise<string> {
  //   const base64EncodedCredentials = new Buffer(`${email}:${password ? password : defaultPassword}`)
  //     .toString('base64')
  //
  //   const { 'access-token': token } = await request.post({
  //     uri: `${baseURL}/oauth2/authorize`,
  //     headers: {
  //       Authorization: `Basic ${base64EncodedCredentials}`
  //     }
  //   })
  //
  //   return token
  // }

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
    return new Buffer(value).toString('base64')
  }
}
