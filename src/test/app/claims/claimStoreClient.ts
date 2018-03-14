import { expect } from 'chai'
import * as mock from 'nock'

import { request } from 'client/request'
import * as HttpStatus from 'http-status-codes'

import { User } from 'idam/user'
import { claimDraft as claimDraftData } from '../../data/draft/claimDraft'
import { claimData } from '../../data/entity/claimData'
import { RequestPromiseOptions } from 'request-promise-native'
import { ClaimStoreClient, claimStoreApiUrl } from 'claims/claimStoreClient'
import { Draft } from '@hmcts/draft-store-client'
import moment = require('moment')
import { DraftClaim } from 'drafts/models/draftClaim'
import { Claim } from 'claims/models/claim'
import { ClaimData } from 'claims/models/claimData'

const claimDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize(claimDraftData), moment(), moment())

const claimantId = 123456

const returnedClaim = {
  submitterId: claimantId,
  createdAt: moment().toISOString(),
  responseDeadline: moment().toISOString(),
  issuedOn: moment().toISOString(),
  claim: claimData
}

const claimant = {
  id: claimantId,
  bearerToken: 'SuperSecretToken'
} as any as User

describe('ClaimStoreClient', () => {
  context('timeouts and retries handling', () => {
    const requestDelayInMillis = 500
    const retryAttempts = 3

    const retryingRequest = request.defaults({
      retryDelay: requestDelayInMillis,
      maxAttempts: retryAttempts
    } as RequestPromiseOptions)

    const claimStoreClient: ClaimStoreClient = new ClaimStoreClient(retryingRequest)

    describe('saveClaim', () => {
      function mockSuccessOnFirstSaveAttempt () {
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .reply(HttpStatus.OK, returnedClaim)
      }

      it('should retrieve a claim that was successfully saved on first attempt', async () => {
        mockSuccessOnFirstSaveAttempt()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant)

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(claimData))
      })

      function mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne () {
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .socketDelay(requestDelayInMillis + 10)
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .reply(HttpStatus.CONFLICT, `Duplicate claim for external id ${claimDraftData.externalId}`)
        mock(`${claimStoreApiUrl}`)
          .get(`/${claimDraftData.externalId}`)
          .reply(HttpStatus.OK, returnedClaim)
      }

      it('should retrieve claim saved on first attempt that timed out and caused a 409 on retry', async () => {
        mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant)

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(claimData))
      })

      function mockInternalServerErrorOnAllAttempts () {
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses other than 409', async () => {
        mockInternalServerErrorOnAllAttempts()

        try {
          await claimStoreClient.saveClaim(claimDraft, claimant)
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }

        expect.fail() // Exception should have been thrown due to 500 response code
      })
    })
  })
})
