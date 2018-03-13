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

const returnedClaim = {
  submitterId: 123456,
  createdAt: moment().toISOString(),
  responseDeadline: moment().toISOString(),
  issuedOn: moment().toISOString(),
  claim: claimData
}

const claimant = {
  id: 123456,
  bearerToken: 'SuperSecretToken'
} as any as User

describe('ClaimStoreClient', () => {
  context('timeouts and retries handling', () => {
    const requestDelay = 1000
    const retryAttempts = 3

    const retryingRequest = request.defaults({
      maxAttempts: retryAttempts,
      retryDelay: requestDelay
    } as RequestPromiseOptions)

    const claimStoreClient: ClaimStoreClient = new ClaimStoreClient(retryingRequest)

    describe('saveClaim', () => {
      it('should retrieve a claim that was successfully saved on first attempt', async () => {
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .reply(HttpStatus.OK, returnedClaim)

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant)
        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(claimData))
      })

      it('should retrieve claim saved on first timed out attempt', async () => {
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .socketDelay(requestDelay + 10)
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .reply(HttpStatus.CONFLICT, `Duplicate claim for external id ${claimDraftData.externalId}`)
        mock(`${claimStoreApiUrl}`)
          .get(`/${claimDraftData.externalId}`)
          .reply(HttpStatus.OK, returnedClaim)

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant)
        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(claimData))
      }).timeout(5000)

      it('should propagate error responses other than 409', async () => {
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')

        try {
          await claimStoreClient.saveClaim(claimDraft, claimant)
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }
        expect.fail()
      }).timeout(5000)
    })
  })
})
