import request from 'client/request'
import * as config from 'config'
import Claim from 'app/claims/models/claim'
import User from 'app/idam/user'
import { DefendantResponse } from 'app/claims/models/defendantResponse'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import { ResponseModelConverter } from 'claims/responseModelConverter'
import { UpdateResponseDeadlineRequest } from 'testing-support/models/updateResponseDeadlineRequest'

const claimApiBaseUrl = `${config.get<string>('claim-store.url')}`
const claimStoreApiUrl = `${claimApiBaseUrl}/claims`
const claimStoreResponsesApiUrl = `${claimApiBaseUrl}/responses/claim`
const testingSupportUrl = `${claimApiBaseUrl}/testing-support/claims`

export default class ClaimStoreClient {
  static saveClaimForUser (user: User): Promise<Claim> {
    const convertedDraftClaim = ClaimModelConverter.convert(user.claimDraft)

    return request.post(`${claimStoreApiUrl}/${user.id}`, {
      body: convertedDraftClaim,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static saveResponseForUser (user: User): Promise<void> {
    const claim: Claim = user.claim
    const response = ResponseModelConverter.convert(user.responseDraft)

    return request.post(`${claimStoreResponsesApiUrl}/${claim.id}/defendant/${user.id}`, {
      body: response,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static retrieveByClaimantId (claimantId: number): Promise<Claim[]> {
    if (!claimantId) {
      return Promise.reject(new Error('Claimant ID is required'))
    }

    return request
      .get(`${claimStoreApiUrl}/claimant/${claimantId}`)
      .then((claims: object[]) => {
        return claims.map((claim: object) => new Claim().deserialize(claim))
      })
  }

  static async retrieveResponse (defendantId: number, claimId: number): Promise<DefendantResponse | undefined> {
    const allResponses: Array<DefendantResponse> = await ClaimStoreClient.retrieveAllResponsesByDefendantId(defendantId)
    const responseForClaim: Array<DefendantResponse> = allResponses.filter(item => item.claimId === claimId)

    if (!responseForClaim) {
      return Promise.resolve(undefined)
    }

    return responseForClaim.pop()
  }

  static retrieveAllResponsesByDefendantId (defendantId: number): Promise<DefendantResponse[]> {
    return request
      .get(`${claimApiBaseUrl}/responses/defendant/${defendantId}`)
      .then(response => response.map(item => new DefendantResponse().deserialize(item)))
  }

  static retrieveByLetterHolderId (letterHolderId: number): Promise<Claim> {
    if (!letterHolderId) {
      return Promise.reject('Letter holder id must be set')
    }

    return request
      .get(`${claimStoreApiUrl}/letter/${letterHolderId}`)
      .then(claim => {
        if (claim) {
          return new Claim().deserialize(claim)
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  static retrieveByExternalId (externalId: string): Promise<Claim> {
    if (!externalId) {
      return Promise.reject(new Error('External id must be set'))
    }

    return request
      .get(`${claimStoreApiUrl}/${externalId}`)
      .then(claim => {
        if (claim) {
          return new Claim().deserialize(claim)
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  static retrieveByDefendantId (defendantId: number): Promise<Claim[]> {
    if (!defendantId) {
      return Promise.reject('Defendant ID is required')
    }

    return request
      .get(`${claimStoreApiUrl}/defendant/${defendantId}`)
      .then((claims: object[]) => claims.map(claim => new Claim().deserialize(claim)))
  }

  static retrieveLatestClaimByDefendantId (defendantId: number): Promise<Claim> {
    if (!defendantId) {
      return Promise.reject('Defendant ID is required')
    }

    return request
      .get(`${claimStoreApiUrl}/defendant/${defendantId}`)
      .then((claims: object[]) => {
        if (claims) { // Workaround below till dashboard is implemented - temporarily client always return last claim
          if (claims.length === 0) {
            throw new Error('Call was successful, but received an empty claim instance')
          }
          return new Claim().deserialize(claims.pop())
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  static linkDefendant (claimId: number, defendantId: number): Promise<Claim> {
    if (!claimId) {
      return Promise.reject('Claim ID is required')
    }
    if (!defendantId) {
      return Promise.reject('Defendant ID is required')
    }

    return request
      .put(`${claimStoreApiUrl}/${claimId}/defendant/${defendantId}`)
      .then(claim => {
        if (claim) {
          return new Claim().deserialize(claim)
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  static requestForMoreTime (claimId: number, user: User): Promise<Claim> {
    if (!claimId) {
      return Promise.reject('Claim ID is required')
    }

    if (!user || !user.bearerToken) {
      return Promise.reject('Authorisation token required')
    }

    return request.post(`${claimStoreApiUrl}/${claimId}/request-more-time`, {
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static updateResponseDeadline (updateRequest: UpdateResponseDeadlineRequest, user: User) {
    if (config.get('featureToggles.testingSupport')) {
      return request.put(
        `${testingSupportUrl}/${updateRequest.claimNumber}/response-deadline/${updateRequest.date.asString()}`,
        {
          headers: {
            Authorization: `Bearer ${user.bearerToken}`
          }
        })
    } else {
      throw new Error('Testing support is not enabled')
    }
  }
}
