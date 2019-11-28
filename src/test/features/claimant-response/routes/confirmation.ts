import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import {
  baseAcceptationClaimantResponseData, baseDeterminationAcceptationClaimantResponseData,
  rejectionClaimantResponseData,
  rejectionClaimantResponseWithDQ
} from 'test/data/entity/claimantResponseData'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'
import { MomentFactory } from 'shared/momentFactory'
import { YesNoOption } from 'models/yesNoOption'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = ClaimantResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Claimant response: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claimant response submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          let claimantResponseData = {
            ...claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj,
            ...{ claimantResponse: rejectionClaimantResponseData }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your claim number:'))
        })

        it('should render page when claim is ended', async () => {
          let claimantResponseData = {
            ...claimStoreServiceMock.sampleFullDefenceRejectEntirely,
            ...{ claimantRespondedAt: '2017-07-25T22:45:51.785' },
            ...{ claimantResponse: baseAcceptationClaimantResponseData }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('You didn’t proceed with the claim'))
            .expect(res => expect(res).to.be.successful.withText('The claim is now ended.'))
        })

        it('should render page when claim is settled', async () => {
          let claimantResponseData = {
            ...claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount,
            ...{ claimantRespondedAt: '2017-07-25T22:45:51.785' },
            ...{ claimantResponse: { ...baseDeterminationAcceptationClaimantResponseData, ...{ settleForAmount: YesNoOption.YES.option } } }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('You’ve accepted their response'))
            .expect(res => expect(res).to.be.successful.withText('The claim is now settled.'))
        })

        it('should render page with hearing requirement', async () => {
          let claimantResponseData = {
            ...claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj,
            ...{ claimantResponse: rejectionClaimantResponseWithDQ }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Download your hearing requirements'))
        })
      })
    })
  })
})
