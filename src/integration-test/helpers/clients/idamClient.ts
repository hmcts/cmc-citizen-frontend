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
    })
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
    const base64EncodedCredentials = new Buffer(pin)
      .toString('base64')

    const { 'access-token': token } = await request.post({
      uri: `${baseURL}/oauth2/authorize`,
      headers: {
        Authorization: `Pin ${base64EncodedCredentials}`
      }
    })

    return token
  }

  /**
   * Authenticate user
   *
   * @param {string} email
   * @param password the users password (optional, default will be used if none provided)
   * @returns {Promise<string>}
   */
  static async authenticateUser (email: string, password: string = undefined): Promise<string> {
    const base64EncodedCredentials = new Buffer(`${email}:${password ? password : defaultPassword}`)
      .toString('base64')

    const { 'access-token': token } = await request.post({
      uri: `${baseURL}/oauth2/authorize`,
      headers: {
        Authorization: `Basic ${base64EncodedCredentials}`
      }
    })

    return token
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

}
