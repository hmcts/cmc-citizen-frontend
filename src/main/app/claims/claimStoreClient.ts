import { request } from 'client/request'
import * as config from 'config'
import { Claim } from 'app/claims/models/claim'
import { User } from 'app/idam/user'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import { ResponseModelConverter } from 'claims/responseModelConverter'
import { ForbiddenError } from '../../errors'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

export const claimApiBaseUrl: string = `${config.get<string>('claim-store.url')}`
export const claimStoreApiUrl: string = `${claimApiBaseUrl}/claims`
const claimStoreResponsesApiUrl: string = `${claimApiBaseUrl}/responses/claim`

export class ClaimStoreClient {
  static saveClaimForUser (draft: Draft<DraftClaim>, user: User): Promise<Claim> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)
    return request.post(`${claimStoreApiUrl}/${user.id}`, {
      body: convertedDraftClaim,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static saveResponseForUser (claimId: number, draft: Draft<ResponseDraft>, user: User): Promise<void> {
    const response = ResponseModelConverter.fromDraft(draft.document)

    return request.post(`${claimStoreResponsesApiUrl}/${claimId}/defendant/${user.id}`, {
      body: response,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static retrieveByClaimantId (claimantId: string): Promise<Claim[]> {
    if (!claimantId) {
      return Promise.reject(new Error('Claimant ID is required'))
    }

    return request
      .get(`${claimStoreApiUrl}/claimant/${claimantId}`)
      .then((claims: object[]) => {
        return claims.map((claim: object) => new Claim().deserialize(claim))
      })
  }

  static retrieveByLetterHolderId (letterHolderId: string): Promise<Claim> {
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

  static retrieveByExternalId (externalId: string, userId: string): Promise<Claim> {
    if (!externalId) {
      return Promise.reject(new Error('External id must be set'))
    }

    return request
      .get(`${claimStoreApiUrl}/${externalId}`)
      .then(claim => {
        if (userId !== claim.submitterId && userId !== claim.defendantId) {
          throw new ForbiddenError()
        }
        if (claim) {
          return new Claim().deserialize(claim)
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  static retrieveByDefendantId (defendantId: string): Promise<Claim[]> {
    if (!defendantId) {
      return Promise.reject('Defendant ID is required')
    }

    return request
      .get(`${claimStoreApiUrl}/defendant/${defendantId}`)
      .then((claims: object[]) => claims.map(claim => new Claim().deserialize(claim)))
  }

  static linkDefendant (claimId: number, defendantId: string): Promise<Claim> {
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

  static isClaimLinked (reference: string): Promise<boolean> {
    if (!reference) {
      return Promise.reject(new Error('Claim reference is required'))
    }

    return request.get(`${claimStoreApiUrl}/${reference}/defendant-link-status`)
      .then(linkStatus => linkStatus.linked)
  }
}
