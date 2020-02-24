import { expect } from 'chai'
import * as mock from 'nock'

import { request } from 'client/request'
import * as HttpStatus from 'http-status-codes'

import { User } from 'idam/user'
import { claimDraft as claimDraftData } from 'test/data/draft/claimDraft'
import { claimData } from 'test/data/entity/claimData'
import { RequestPromiseOptions } from 'request-promise-native'
import { claimStoreApiUrl, ClaimStoreClient } from 'claims/claimStoreClient'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Claim } from 'claims/models/claim'
import { ClaimData } from 'claims/models/claimData'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'
import * as moment from 'moment'
import { sampleOrdersDraftObj } from 'test/http-mocks/draft-store'
import { ReviewOrder } from 'claims/models/reviewOrder'
import { OrdersDraft } from 'orders/draft/ordersDraft'
import { resolveSaveOrder, sampleClaimIssueObj } from 'test/http-mocks/claim-store'
import { MadeBy } from 'claims/models/madeBy'

const claimDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize(claimDraftData), moment(), moment())

const claimantId = 123456

const returnedClaim = {
  submitterId: claimantId,
  createdAt: moment().toISOString(),
  responseDeadline: moment().toISOString(),
  issuedOn: moment().toISOString(),
  claim: { ...claimData, interest: { type: ClaimInterestType.NO_INTEREST, interestDate: undefined } }
}

const expectedClaimData = {
  ...claimData,
  interest: { type: ClaimInterestType.NO_INTEREST },
  interestDate: undefined
}

const claimant = {
  id: claimantId,
  bearerToken: 'SuperSecretToken'
} as any as User

const paymentResponse = {
  nextUrl: 'http://localhost/payment-page'
}

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

      it('should retrieve a claim that was successfully saved on first attempt with feature toggles', async () => {
        mockSuccessOnFirstSaveAttempt()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant, 'admissions')

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })

      it('should retrieve a claim that was successfully saved on first attempt without feature toggles', async () => {
        mockSuccessOnFirstSaveAttempt()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant)

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
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
        resolveLinkDefendant()
        mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant, 'admissions')

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })

      function resolveLinkDefendant () {
        mock(`${claimStoreApiUrl}`)
          .put('/defendant/link')
          .reply(HttpStatus.OK)
      }

      function mockInternalServerErrorOnAllAttempts () {
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses other than 409', async () => {
        mockInternalServerErrorOnAllAttempts()

        try {
          await claimStoreClient.saveClaim(claimDraft, claimant, 'admissions')
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }

        expect.fail() // Exception should have been thrown due to 500 response code
      })
    })

    describe('saveOrder', () => {
      const expectedData = {
        reason: 'some reason',
        requestedBy: MadeBy.CLAIMANT,
        requestedAt: '2017-07-25T22:45:51.785'
      }
      const ordersDraft: OrdersDraft = new OrdersDraft().deserialize(sampleOrdersDraftObj)

      it('should retrieve an order that was successfully saved', async () => {
        resolveSaveOrder()
        const claim: Claim = await claimStoreClient.saveOrder(ordersDraft, new Claim().deserialize(sampleClaimIssueObj), claimant)

        expect(claim.reviewOrder).to.deep.equal(new ReviewOrder().deserialize(expectedData))
      })

      function mockInternalServerErrorOnAllAttempts () {
        mock(`${claimStoreApiUrl}`)
          .put(`/${ordersDraft.externalId}/review-order`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses other than 409 for orders', async () => {
        mockInternalServerErrorOnAllAttempts()

        try {
          await claimStoreClient.saveOrder(ordersDraft, new Claim().deserialize(sampleClaimIssueObj), claimant)
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }

        expect.fail() // Exception should have been thrown due to 500 response code
      })
    })

    describe('Initiate citizen payment', async () => {
      function resolveInitiatePayment () {
        mock(`${claimStoreApiUrl}`)
          .post(`/initiate-citizen-payment`)
          .reply(HttpStatus.OK, paymentResponse)
      }

      it('should return nextUrl on successful initiate payment call', async () => {
        resolveInitiatePayment()
        const returnedUrl: string = (await claimStoreClient.initiatePayment(claimDraft, claimant)).nextUrl
        expect(returnedUrl).to.deep.equal(paymentResponse.nextUrl)
      })

      function mockInternalServerErrorOnInitiatePayment () {
        mock(`${claimStoreApiUrl}`)
          .post(`/initiate-citizen-payment`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses', async () => {
        mockInternalServerErrorOnInitiatePayment()
        try {
          await claimStoreClient.initiatePayment(claimDraft, claimant)
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }

        expect.fail() // Exception should have been thrown due to 500 response code
      })
    })

    describe('Resume citizen payment', async () => {
      function resolveInitiatePayment () {
        mock(`${claimStoreApiUrl}`)
          .put(`/resume-citizen-payment`)
          .reply(HttpStatus.OK, paymentResponse)
      }

      it('should return nextUrl on successful resume payment call', async () => {
        resolveInitiatePayment()
        const returnedUrl: string = (await claimStoreClient.resumePayment(claimDraft, claimant)).nextUrl
        expect(returnedUrl).to.deep.equal(paymentResponse.nextUrl)
      })

      function mockInternalServerErrorOnResumePayment () {
        mock(`${claimStoreApiUrl}`)
          .put(`/resume-citizen-payment`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses', async () => {
        mockInternalServerErrorOnResumePayment()
        try {
          await claimStoreClient.resumePayment(claimDraft, claimant)
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }

        expect.fail() // Exception should have been thrown due to 500 response code
      })
    })

    describe('createCitizenClaim', async () => {

      function mockCreateCitizenClaimCall () {
        mock(`${claimStoreApiUrl}`)
          .put(`/create-citizen-claim`)
          .reply(HttpStatus.OK, returnedClaim)
      }
      it('should return a claim that was successfully saved', async () => {
        mockCreateCitizenClaimCall()
        const claim: Claim = await claimStoreClient.createCitizenClaim(claimDraft, claimant, 'admissions')
        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })

      function mockInternalServerErrorOnAllAttempts () {
        mock(`${claimStoreApiUrl}`)
          .put(`/create-citizen-claim`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses', async () => {
        mockInternalServerErrorOnAllAttempts()
        try {
          await claimStoreClient.createCitizenClaim(claimDraft, claimant, 'admissions')
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
