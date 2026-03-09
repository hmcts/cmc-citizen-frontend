import { expect } from 'chai'
import * as mock from 'nock'

import { request } from 'client/request'
import * as HttpStatus from 'http-status-codes'

import { User } from 'idam/user'
import { claimDraft as claimDraftData, claimDraftHelpWithFees } from 'test/data/draft/claimDraft'
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
import * as idamServiceMock from 'test/http-mocks/idam'


const claimDraft = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize(claimDraftData), moment(), moment())
const claimDraftHwf = new Draft<DraftClaim>(123, 'claim', new DraftClaim().deserialize(claimDraftHelpWithFees), moment(), moment())

const claimantId = 123456

const returnedClaim = {
  submitterId: claimantId,
  createdAt: moment().toISOString(),
  responseDeadline: moment().toISOString(),
  issuedOn: moment().toISOString(),
  claim: { ...claimData, interest: { type: ClaimInterestType.NO_INTEREST, interestDate: undefined } }
}
const returnedClaimWithHelpWithFee = {
  submitterId: claimantId,
  createdAt: moment().toISOString(),
  responseDeadline: moment().toISOString(),
  issuedOn: moment().toISOString(),
  claim: { ...claimData, interest: { type: ClaimInterestType.NO_INTEREST, interestDate: undefined }, helpWithFeesNumber: '987654', helpWithFeesType: 'ClaimIssue' }
}

const expectedClaimData = {
  ...claimData,
  interest: { type: ClaimInterestType.NO_INTEREST },
  interestDate: undefined
}
const expectedClaimDataWithHwf = {
  ...claimData,
  interest: { type: ClaimInterestType.NO_INTEREST },
  interestDate: undefined,
  helpWithFeesNumber: '987654',
  helpWithFeesType: 'ClaimIssue'
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
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.OK, returnedClaim)
      }

      it('should retrieve a claim that was successfully saved on first attempt with feature toggles', async () => {
        mockSuccessOnFirstSaveAttempt()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant, '')

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })

      it('should retrieve a claim that was successfully saved on first attempt without feature toggles', async () => {
        mockSuccessOnFirstSaveAttempt()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant)

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })

      function mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .delayConnection(requestDelayInMillis + 10)
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.CONFLICT, `Duplicate claim for external id ${claimDraftData.externalId}`)
        mock(`${claimStoreApiUrl}`)
          .get(`/${claimDraftData.externalId}`)
          .reply(HttpStatus.OK, returnedClaim)
      }

      it('should retrieve claim saved on first attempt that timed out and caused a 409 on retry', async () => {
        resolveLinkDefendant()
        mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne()

        const claim: Claim = await claimStoreClient.saveClaim(claimDraft, claimant, '')

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })

      function resolveLinkDefendant () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .put('/defendant/link')
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.OK)
      }

      function mockInternalServerErrorOnAllAttempts () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses other than 409', async () => {
        mockInternalServerErrorOnAllAttempts()

        try {
          await claimStoreClient.saveClaim(claimDraft, claimant, '')
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }

        expect.fail() // Exception should have been thrown due to 500 response code
      })
    })

    describe('saveHelpWithFeesClaim', () => {
      function mockSuccessOnFirstSaveAttempt () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}/hwf`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.OK, { ...returnedClaimWithHelpWithFee })
      }

      it('should retrieve a claim that was successfully saved on first attempt with feature toggles', async () => {
        mockSuccessOnFirstSaveAttempt()

        const claim: Claim = await claimStoreClient.saveHelpWithFeesClaim(claimDraftHwf, claimant, 'admissions')
        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimDataWithHwf))
      })

      it('should retrieve a claim that was successfully saved on first attempt without feature toggles', async () => {
        mockSuccessOnFirstSaveAttempt()

        const claim: Claim = await claimStoreClient.saveHelpWithFeesClaim(claimDraft, claimant)

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimDataWithHwf))
      })

      function mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}/hwf`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .delayConnection(requestDelayInMillis + 10)
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}/hwf`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.CONFLICT, `Duplicate claim for external id ${claimDraftData.externalId}`)
        mock(`${claimStoreApiUrl}`)
          .get(`/${claimDraftData.externalId}`)
          .reply(HttpStatus.OK, returnedClaim)
      }
      it('should retrieve claim saved on first attempt that timed out and caused a 409 on retry', async () => {
        mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne()

        const claim: Claim = await claimStoreClient.saveHelpWithFeesClaim(claimDraft, claimant, '')

        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })
      function mockInternalServerErrorOnAllAttempts () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimant.id}/hwf`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses other than 409', async () => {
        mockInternalServerErrorOnAllAttempts()

        try {
          await claimStoreClient.saveHelpWithFeesClaim(claimDraft, claimant, 'admissions')
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
        idamServiceMock.resolveRetrieveServiceToken()
        resolveSaveOrder()
        const claim: Claim = await claimStoreClient.saveOrder(ordersDraft, new Claim().deserialize(sampleClaimIssueObj), claimant)

        expect(claim.reviewOrder).to.deep.equal(new ReviewOrder().deserialize(expectedData))
      })

      function mockInternalServerErrorOnAllAttempts () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .put(`/${ordersDraft.externalId}/review-order`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
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
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/initiate-citizen-payment`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.OK, paymentResponse)
      }

      it('should return nextUrl on successful initiate payment call', async () => {
        resolveInitiatePayment()
        const returnedUrl: string = await claimStoreClient.initiatePayment(claimDraft, claimant)
        expect(returnedUrl).to.deep.equal(paymentResponse.nextUrl)
      })

      function mockInternalServerErrorOnInitiatePayment () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/initiate-citizen-payment`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
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
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .put(`/resume-citizen-payment`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.OK, paymentResponse)
      }

      it('should return nextUrl on successful resume payment call', async () => {
        resolveInitiatePayment()
        const returnedUrl: string = await claimStoreClient.resumePayment(claimDraft, claimant)
        expect(returnedUrl).to.deep.equal(paymentResponse.nextUrl)
      })

      function mockInternalServerErrorOnResumePayment () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .put(`/resume-citizen-payment`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
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
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .put(`/create-citizen-claim`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .reply(HttpStatus.OK, returnedClaim)
      }
      it('should return a claim that was successfully saved', async () => {
        mockCreateCitizenClaimCall()
        const claim: Claim = await claimStoreClient.createCitizenClaim(claimDraft, claimant, '')
        expect(claim.claimData).to.deep.equal(new ClaimData().deserialize(expectedClaimData))
      })

      function mockInternalServerErrorOnAllAttempts () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .put(`/create-citizen-claim`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should propagate error responses', async () => {
        mockInternalServerErrorOnAllAttempts()
        try {
          await claimStoreClient.createCitizenClaim(claimDraft, claimant, '')
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(err.error).to.equal('An unexpected error occurred')
          return
        }

        expect.fail() // Exception should have been thrown due to 500 response code
      })

      function mockInternalServerErrorforSaveBreathingSpaceOnAllAttempts () {
        idamServiceMock.resolveRetrieveServiceToken()
        mock(`${claimStoreApiUrl}`)
          .post(`/${claimDraftData.externalId}/breathingSpace`)
          .matchHeader('ServiceAuthorization', `Bearer ${idamServiceMock.defaultAuthToken}`)
          .times(retryAttempts)
          .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred')
      }

      it('should fail while saving the Breathing space', async () => {
        mockInternalServerErrorforSaveBreathingSpaceOnAllAttempts()
        try {
          let draft: DraftClaim = new DraftClaim()
          draft.breathingSpace.breathingSpaceType = 'STANDARD_BS_LIFTED'
          draft.breathingSpace.breathingSpaceEnteredDate = moment('9999-09-09')
          draft.breathingSpace.breathingSpaceEndDate = moment('9999-09-09')
          draft.breathingSpace.breathingSpaceExternalId = 'bbb89313-7e4c-4124-8899-34389312033a'
          draft.breathingSpace.breathingSpaceReferenceNumber = 'BS12345678'
          draft.breathingSpace.breathingSpaceLiftedFlag = 'NO'
          draft.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate = moment('9999-09-09')
          await claimStoreClient.saveBreatingSpace(draft, claimant)
        } catch (err) {
          expect(err.statusCode).to.equal(HttpStatus.NOT_FOUND)
          return
        }

        expect.fail() // Exception should have been thrown due to 404 response code
      })
    })
  })
})
