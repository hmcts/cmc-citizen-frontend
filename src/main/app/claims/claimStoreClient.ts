import { request as requestPromiseApi, RequestPromiseAPI } from 'client/request'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'
import { Claim } from 'app/claims/models/claim'
import { User } from 'app/idam/user'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import { ResponseModelConverter } from 'claims/responseModelConverter'
import { ForbiddenError } from '../../errors'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { Logger } from '@hmcts/nodejs-logging'

export const claimApiBaseUrl: string = `${config.get<string>('claim-store.url')}`
export const claimStoreApiUrl: string = `${claimApiBaseUrl}/claims`
const claimStoreResponsesApiUrl: string = `${claimApiBaseUrl}/responses/claim`

const logger = Logger.getLogger('claims/claimStoreClient')

export class ClaimStoreClient {
  constructor (private request: RequestPromiseAPI = requestPromiseApi) {
    // Nothing to do
  }

  saveClaim (draft: Draft<DraftClaim>, claimant: User): Promise<Claim> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)
    return this.request
      .post(`${claimStoreApiUrl}/${claimant.id}`, {
        body: convertedDraftClaim,
        headers: {
          Authorization: `Bearer ${claimant.bearerToken}`
        }
      })
      .then(claim => {
        return new Claim().deserialize(claim)
      })
      .catch((err) => {
        if (err.statusCode === HttpStatus.CONFLICT) {
          logger.warn(`Claim ${draft.document.externalId} appears to have been saved successfully on initial timed out attempt, retrieving the saved instance`)
          return this.retrieveByExternalId(draft.document.externalId, claimant)
        } else {
          throw err
        }
      })
  }

  saveResponseForUser (externalId: string, draft: Draft<ResponseDraft>, user: User): Promise<void> {
    const response = ResponseModelConverter.convert(draft.document)

    return this.request
      .post(`${claimStoreResponsesApiUrl}/${externalId}/defendant/${user.id}`, {
        body: response,
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
  }

  retrieveByClaimantId (user: User): Promise<Claim[]> {
    if (!user) {
      return Promise.reject(new Error('User is required'))
    }

    return this.request
      .get(`${claimStoreApiUrl}/claimant/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then((claims: object[]) => {
        return claims.map((claim: object) => new Claim().deserialize(claim))
      })
  }

  retrieveByLetterHolderId (letterHolderId: string, bearerToken: string): Promise<Claim> {
    if (!letterHolderId) {
      return Promise.reject(new Error('Letter holder id must be set'))
    }

    return this.request
      .get(`${claimStoreApiUrl}/letter/${letterHolderId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then(claim => {
        if (claim) {
          return new Claim().deserialize(claim)
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  retrieveByExternalId (externalId: string, user: User): Promise<Claim> {
    if (!externalId || !user) {
      return Promise.reject(new Error('External id must be set and user must be set'))
    }

    return this.request
      .get(`${claimStoreApiUrl}/${externalId}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then(claim => {
        if (!FeatureToggles.isEnabled('ccd')) { // CCD does authorisation checks for us
          if (user.id !== claim.submitterId && user.id !== claim.defendantId) {
            throw new ForbiddenError()
          }
        }
        return new Claim().deserialize(claim)
      })
  }

  retrieveByDefendantId (user: User): Promise<Claim[]> {
    if (!user) {
      return Promise.reject('User is required')
    }

    return this.request
      .get(`${claimStoreApiUrl}/defendant/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then((claims: object[]) => claims.map(claim => new Claim().deserialize(claim)))
  }

  linkDefendant (user: User): Promise<void> {
    return this.request
      .put(`${claimStoreApiUrl}/defendant/link`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
  }

  linkDefendantV1 (externalId: string, user: User): Promise<Claim> {
    if (!externalId) {
      return Promise.reject(new Error('External ID is required'))
    }
    if (!user.id) {
      return Promise.reject(new Error('User is required'))
    }

    return this.request
      .put(`${claimStoreApiUrl}/${externalId}/defendant/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then(claim => {
        if (claim) {
          return new Claim().deserialize(claim)
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  requestForMoreTime (externalId: string, user: User): Promise<Claim> {
    if (!externalId) {
      return Promise.reject(new Error('External ID is required'))
    }

    if (!user || !user.bearerToken) {
      return Promise.reject(new Error('Authorisation token required'))
    }

    return this.request
      .post(`${claimStoreApiUrl}/${externalId}/request-more-time`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
  }

  isClaimLinked (reference: string): Promise<boolean> {
    if (!reference) {
      return Promise.reject(new Error('Claim reference is required'))
    }

    return this.request
      .get(`${claimStoreApiUrl}/${reference}/defendant-link-status`)
      .then(linkStatus => linkStatus.linked)
  }
}
