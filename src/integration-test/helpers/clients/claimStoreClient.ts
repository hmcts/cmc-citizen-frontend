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

    return request.get(`${baseURL}/claims/${referenceNumber}`, {
      headers: {
        Authorization: `Bearer ${owner.bearerToken}`
      }
    })
  }

  /**
   * Saves claim in the claim store
   *
   * @param {ClaimData} claimData - claim data
   * @param {User} submitter - user that submits claim
   * @returns {Promise<Claim>}
   */
  static create (claimData: ClaimData, submitter: User): Promise<Claim> {
    if (!claimData) {
      return Promise.reject('Claim data is required')
    }
    if (!submitter) {
      return Promise.reject('Submitter is required')
    }

    return request.post(`${baseURL}/claims/${submitter.id}`, {
      body: claimData,
      headers: {
        Authorization: `Bearer ${submitter.bearerToken}`
      }
    })
  }

  /**
   * Links defendant to claim in the claim store
   *
   * @param {number} externalId - claim external ID
   * @param {string} defendant - defendant ID
   * @returns {Promise<Claim>}
   */
  static linkDefendant (externalId: string, defendant: User): Promise<Claim> {
    if (!externalId) {
      return Promise.reject('Claim ID is required')
    }
    if (!defendant) {
      return Promise.reject('Defendant is required')
    }

    return request.put(`${baseURL}/claims/${externalId}/defendant/${defendant.id}`, {
      headers: {
        Authorization: `Bearer ${defendant.bearerToken}`
      }
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

    return request.post(`${baseURL}/responses/claim/${externalId}/defendant/${defendant.id}`, {
      body: responseData,
      headers: {
        Authorization: `Bearer ${defendant.bearerToken}`
      }
    })
  }
}
