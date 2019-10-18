import { request } from 'integration-test/helpers/clients/base/request'

const baseURL: string = process.env.CLAIM_STORE_URL

export class ClaimStoreClient {

  /**
   * Retrieves claim from the claim store by claim reference number
   *
   * @param {string} referenceNumber - claim reference number
   * @param {User} owner - claim owner
   * @returns {Promise<Claim>}
   */
  static retrieveByReferenceNumber (referenceNumber: string, owner: User): Promise<Claim> {
    if (!referenceNumber) {
      return Promise.reject('Claim reference number is required')
    }
    if (!owner) {
      return Promise.reject('Claim owner is required')
    }

    const options = {
      uri: `${baseURL}/claims/${referenceNumber}`,
      headers: {
        Authorization: `Bearer ${owner.bearerToken}`
      }
    }
    return request(options).then(function (response) {
      return response
    })
  }

  static isOpen (referenceNumber: string): Promise<boolean> {
    return request.get(`${baseURL}/claims/${referenceNumber}/metadata`, {})
      .then(function (response) {
        return response.state === 'OPEN'
      })
  }

  /**
   * Saves claim in the claim store
   *
   * @param {ClaimData} claimData - claim data
   * @param {User} submitter - user that submits claim
   * @param (features} string array of enabled features for user
   * @returns {Promise<Claim>}
   */
  static create (claimData: ClaimData, submitter: User, features: string[]): Promise<Claim> {
    if (!claimData) {
      return Promise.reject('Claim data is required')
    }
    if (!submitter) {
      return Promise.reject('Submitter is required')
    }

    const headers = {
      Authorization: `Bearer ${submitter.bearerToken}`,
      Features: features
    }

    return request.post(`${baseURL}/claims/${submitter.id}`, {
      body: claimData,
      headers
    }).then(function (response) {
      return response
    })
  }

  /**
   * Links defendant to claim in the claim store
   *
   * @param {string} defendant - defendant ID
   * @returns {Promise<Claim>}
   */
  static linkDefendant (defendant: User): Promise<Claim> {
    if (!defendant) {
      return Promise.reject('Defendant is required')
    }

    const options = {
      method: 'PUT',
      uri: `${baseURL}/claims/defendant/link`,
      headers: {
        Authorization: `Bearer ${defendant.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  /**
   * Saves response to a claim identified by the ID in the claim store
   *
   * @param {number} externalId - claim external ID
   * @param {any} responseData - response data
   * @param {User} defendant - user that makes response
   * @returns {Promise<Claim>}
   */
  static respond (externalId: string, responseData: ResponseData, defendant: User): Promise<Claim> {
    if (!externalId) {
      return Promise.reject('Claim ID is required')
    }
    if (!responseData) {
      return Promise.reject('Response data is required')
    }
    if (!defendant) {
      return Promise.reject('Defendant is required')
    }

    const options = {
      method: 'POST',
      uri: `${baseURL}/responses/claim/${externalId}/defendant/${defendant.id}`,
      body: responseData,
      headers: {
        Authorization: `Bearer ${defendant.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  static addRoleToUser (bearerToken: string, role: string): Promise<void> {
    if (!bearerToken) {
      return Promise.reject(new Error('bearerToken is required'))
    }

    const options = {
      method: 'POST',
      uri: `${baseURL}/user/roles`,
      body: { role: role },
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    }
    return request(options).then()
  }
}
