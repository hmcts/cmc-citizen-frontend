import { request as requestPromiseApi, RequestPromiseAPI } from 'client/request'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import { ResponseModelConverter } from 'claims/responseModelConverter'
import { ForbiddenError } from 'errors'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Logger } from '@hmcts/nodejs-logging'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { DraftPaidInFull } from 'paid-in-full/draft/draftPaidInFull'
import { ClaimantResponseConverter } from 'claims/converters/claimantResponseConverter'

export const claimApiBaseUrl: string = `${config.get<string>('claim-store.url')}`
export const claimStoreApiUrl: string = `${claimApiBaseUrl}/claims`
const claimStoreResponsesApiUrl: string = `${claimApiBaseUrl}/responses/claim`

const logger = Logger.getLogger('claims/claimStoreClient')

function buildCaseSubmissionHeaders (claimant: User, features: string[]): object {
  const headers = {
    Authorization: `Bearer ${claimant.bearerToken}`
  }

  if (features.length > 0) {
    headers['Features'] = features
  }

  return headers
}

export class ClaimStoreClient {
  constructor (private request: RequestPromiseAPI = requestPromiseApi) {
    // Nothing to do
  }

  savePrePayment (externalId: string, submitter: User): Promise<string> {
    return this.request.post(`${claimStoreApiUrl}/${externalId}/pre-payment`, {
      headers: {
        Authorization: `Bearer ${submitter.bearerToken}`
      }
    }).then(caseReference => {
      return caseReference.case_reference
    })
  }

  savePaidInFull (externalId: string, submitter: User, draft: DraftPaidInFull): Promise<Claim> {
    return this.request
      .put(`${claimStoreApiUrl}/${externalId}/paid-in-full`, {
        body: {
          'moneyReceivedOn': draft.datePaid.date.toMoment()
        },
        headers: {
          Authorization: `Bearer ${submitter.bearerToken}`
        }
      })
      .then(claim => {
        return new Claim().deserialize(claim)
      })
  }

  saveClaim (draft: Draft<DraftClaim>, claimant: User, ...features: string[]): Promise<Claim> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)

    return this.request
      .post(`${claimStoreApiUrl}/${claimant.id}`, {
        body: convertedDraftClaim,
        headers: buildCaseSubmissionHeaders(claimant, features)
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

  saveResponseForUser (claim: Claim, draft: Draft<ResponseDraft>, user: User): Promise<void> {
    const response = ResponseModelConverter.convert(draft.document, claim)
    const externalId: string = claim.externalId

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
      .then((json: object) => {
        const claim = new Claim().deserialize(json)
        if (user.id !== claim.claimantId && user.id !== claim.defendantId) {
          throw new ForbiddenError()
        }
        return claim
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

  async retrieveUserRoles (user: User): Promise<string[]> {
    if (!user) {
      return Promise.reject(new Error('User must be set'))
    }

    return this.request
      .get(`${claimApiBaseUrl}/user/roles`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
  }

  // This is a tactical solution until SIDAM is able to add roles to user ID
  addRoleToUser (user: User, role: string): Promise<void> {
    if (!user) {
      return Promise.reject(new Error('User is required'))
    }

    if (!role) {
      return Promise.reject(new Error('role is required'))
    }

    return this.request
      .post(`${claimApiBaseUrl}/user/roles`, {
        body: { role: role },
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
  }

  saveClaimantResponse (claim: Claim, draft: Draft<DraftClaimantResponse>, user: User): Promise<void> {
    const isDefendantBusiness = claim.claimData.defendant.isBusiness()
    const response = ClaimantResponseConverter.convertToClaimantResponse(draft.document, isDefendantBusiness)
    const externalId: string = claim.externalId
    return this.request
      .post(`${claimApiBaseUrl}/responses/${externalId}/claimant/${user.id}`, {
        body: response,
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
  }
}
