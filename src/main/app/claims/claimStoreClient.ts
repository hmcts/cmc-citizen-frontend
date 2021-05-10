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
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { OrdersDraft } from 'orders/draft/ordersDraft'
import { OrdersConverter } from 'claims/ordersConverter'
import { ReviewOrder } from 'claims/models/reviewOrder'
import moment = require('moment')

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

  saveHelpWithFeesClaim (draft: Draft<DraftClaim>, claimant: User, ...features: string[]): Promise<Claim> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)

    return this.request
      .post(`${claimStoreApiUrl}/${claimant.id}/hwf`, {
        body: convertedDraftClaim,
        headers: buildCaseSubmissionHeaders(claimant, features)
      })
      .then(claim => new Claim().deserialize(claim))
      .catch(err => {
        if (err.statusCode === HttpStatus.CONFLICT) {
          logger.warn(`Claim ${draft.document.externalId} appears to have been saved successfully on initial timed out attempt, retrieving the saved instance`)
          return this.retrieveByExternalId(draft.document.externalId, claimant)
        }
        throw err
      })
  }

  saveBreatingSpace (draft: DraftClaim, claimant: User): Promise<Claim> {
    try {
      let endDate = moment('9999-09-09').format('YYYY-MM-DD')
      let StartDate = moment('9999-09-09').format('YYYY-MM-DD')
      let endDateByInsolvencyTeam = moment('9999-09-09').format('YYYY-MM-DD')
      let startDateByInsolvencyTeam = moment('9999-09-09').format('YYYY-MM-DD')

      if (draft.breathingSpace.breathingSpaceEndDate !== undefined && draft.breathingSpace.breathingSpaceEndDate !== null) {
        endDate = moment(draft.breathingSpace.breathingSpaceEndDate).format('YYYY-MM-DD')
      }

      if (draft.breathingSpace.breathingSpaceEnteredDate !== undefined && draft.breathingSpace.breathingSpaceEnteredDate !== null) {
        StartDate = moment(draft.breathingSpace.breathingSpaceEnteredDate).format('YYYY-MM-DD')
      }

      if (draft.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate !== undefined && draft.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate !== null) {
        startDateByInsolvencyTeam = moment(draft.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate).format('YYYY-MM-DD')
      }

      if (draft.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate !== undefined && draft.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate !== null) {
        endDateByInsolvencyTeam = moment(draft.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate).format('YYYY-MM-DD')
      }

      return this.request
        .post(`${claimStoreApiUrl}/${draft.breathingSpace.breathingSpaceExternalId.toString()}/breathingSpace`, {
          body: {
            'bs_entered_date_by_insolvency_team': startDateByInsolvencyTeam,
            'bs_entered_date': StartDate,
            'bs_expected_end_date': endDate,
            'bs_reference_number': draft.breathingSpace.breathingSpaceReferenceNumber !== undefined ? draft.breathingSpace.breathingSpaceReferenceNumber.toString() : '',
            'bs_type': draft.breathingSpace.breathingSpaceType.toString(),
            'bs_lifted_flag': draft.breathingSpace.breathingSpaceLiftedFlag.toString(),
            'bs_lifted_date_by_insolvency_team': endDateByInsolvencyTeam
          },
          headers: {
            Authorization: `Bearer ${claimant.bearerToken}`
          }
        })
        .then(claim => new Claim().deserialize(claim))
        .catch(err => {
          if (err.statusCode === HttpStatus.CONFLICT) {
            logger.warn(`Claim ${draft.externalId} appears to have been saved successfully on initial timed out attempt, retrieving the saved instance`)
            return this.retrieveByExternalId(draft.externalId, claimant)
          }
          throw err
        })
    } catch (error) {
      return error
    }
  }

  updateHelpWithFeesClaim (draft: Draft<DraftClaim>, claimant: User, ...features: string[]): Promise<Claim> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)

    return this.request
      .put(`${claimStoreApiUrl}/resume-hwf`, {
        body: convertedDraftClaim,
        headers: buildCaseSubmissionHeaders(claimant, features)
      })
      .then(claim => new Claim().deserialize(claim))
      .catch(err => {
        if (err.statusCode === HttpStatus.CONFLICT) {
          logger.warn(`Claim ${draft.document.externalId} appears to have been saved successfully on initial timed out attempt, retrieving the saved instance`)
          return this.retrieveByExternalId(draft.document.externalId, claimant)
        }
        throw err
      })
  }

  createCitizenClaim (draft: Draft<DraftClaim>, claimant: User, ...features: string[]): Promise<Claim> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)

    return this.request
      .put(`${claimStoreApiUrl}/create-citizen-claim`, {
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

  initiatePayment (draft: Draft<DraftClaim>, claimant: User): Promise<string> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)

    return this.request
      .post(`${claimStoreApiUrl}/initiate-citizen-payment`, {
        body: convertedDraftClaim,
        headers: buildCaseSubmissionHeaders(claimant, [])
      })
      .then(response => {
        return response.nextUrl
      })
  }

  resumePayment (draft: Draft<DraftClaim>, claimant: User): Promise<string> {
    const convertedDraftClaim = ClaimModelConverter.convert(draft.document)

    return this.request
      .put(`${claimStoreApiUrl}/resume-citizen-payment`, {
        body: convertedDraftClaim,
        headers: buildCaseSubmissionHeaders(claimant, [])
      })
      .then(response => {
        return response.nextUrl
      })
  }

  async saveResponseForUser (claim: Claim, draft: Draft<ResponseDraft>, mediationDraft: Draft<MediationDraft>, directionsQuestionnaireDraft: Draft<DirectionsQuestionnaireDraft>, user: User): Promise<void> {
    const response = await ResponseModelConverter.convert(draft.document, mediationDraft.document, directionsQuestionnaireDraft.document, claim)
    const externalId: string = claim.externalId
    const options = {
      method: 'POST',
      uri: `${claimStoreResponsesApiUrl}/${externalId}/defendant/${user.id}`,
      body: response,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return requestPromiseApi(options).then(function () {
      return Promise.resolve()
    })
  }

  saveOrder (ordersDraft: OrdersDraft, claim: Claim, user: User): Promise<Claim> {
    const reviewOrder: ReviewOrder = OrdersConverter.convert(ordersDraft, claim, user)
    const externalId: string = ordersDraft.externalId

    const options = {
      method: 'PUT',
      uri: `${claimStoreApiUrl}/${externalId}/review-order`,
      body: reviewOrder,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return requestPromiseApi(options)
      .then(newClaim => {
        return new Claim().deserialize(newClaim)
      })
  }

  retrieveByClaimantId (user: User, pageNo: number): Promise<Claim[]> {
    if (!user) {
      return Promise.reject(new Error('User is required'))
    }

    if (pageNo === undefined) {
      pageNo = 0
    }

    return this.request
      .get(`${claimStoreApiUrl}/claimant/${user.id}?pageNo=${pageNo}`, {
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

  retrieveByDefendantId (user: User, pageNo: number): Promise<Claim[]> {
    if (!user) {
      return Promise.reject('User is required')
    }

    if (pageNo === undefined) {
      pageNo = 0
    }

    return this.request
      .get(`${claimStoreApiUrl}/defendant/${user.id}?pageNo=${pageNo}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then((claims: object[]) => claims.map(claim => new Claim().deserialize(claim)))
  }

  linkDefendant (user: User, letterHolderId: string): Promise<void> {
    const options = {
      method: 'PUT',
      uri: `${claimStoreApiUrl}/defendant/link`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        LetterHolderID: letterHolderId
      }
    }
    return requestPromiseApi(options).then(function () {
      return Promise.resolve()
    })
  }

  requestForMoreTime (externalId: string, user: User): Promise<Claim> {
    if (!externalId) {
      return Promise.reject(new Error('External ID is required'))
    }

    if (!user || !user.bearerToken) {
      return Promise.reject(new Error('Authorisation token required'))
    }

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/request-more-time`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return requestPromiseApi(options).then(function (response) {
      return response
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

    const options = {
      method: 'POST',
      uri: `${claimApiBaseUrl}/user/roles`,
      body: { role: role },
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return requestPromiseApi(options).then(function () {
      return Promise.resolve()
    })
  }

  async saveClaimantResponse (claim: Claim, draft: Draft<DraftClaimantResponse>, mediationDraft: Draft<MediationDraft>, user: User, directionsQuestionnaireDraft?: DirectionsQuestionnaireDraft): Promise<void> {
    const isDefendantBusiness = claim.claimData.defendant.isBusiness()
    const response = await ClaimantResponseConverter.convertToClaimantResponse(claim, draft.document, mediationDraft.document, isDefendantBusiness, directionsQuestionnaireDraft)
    const externalId: string = claim.externalId

    const options = {
      method: 'POST',
      uri: `${claimApiBaseUrl}/responses/${externalId}/claimant/${user.id}`,
      body: response,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return requestPromiseApi(options).then(function () {
      return Promise.resolve()
    })
  }

  retrievePaginationInfo (user: User, type: string): Promise<string[]> {
    if (!user) {
      return Promise.reject('User is required')
    }

    return this.request
      .get(`${claimStoreApiUrl}/pagination-metadata?userType=${type}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then(response => {
        return response
      })
  }
}
