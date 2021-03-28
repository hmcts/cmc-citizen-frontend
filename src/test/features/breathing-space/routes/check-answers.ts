import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'

import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { SignatureType } from 'common/signatureType'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = BreathingSpacePaths.bsCheckAnswersPage.uri

describe('Breathing Space: check-answer page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('Breathing Space check your answer', () => {
        it('should render page when everything is fine', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          draftStoreServiceMock.resolveFind('claim')
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting'))
        })

        it('should render the page with all the values', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          draftStoreServiceMock.resolveFind('claim')
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ breathingSpaceType: 'STANDARD_BS_ENTERED', bsEndDate: '2025-01-01', breathingSpaceEndDate: '2021-01-01', breathingSpaceExternalId: 'bbb89313-7e4c-4124-8899-34389312033a', breathingSpaceReferenceNumber: 'BS-1234567890' })
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting'))
            .expect(res => expect(res).to.be.successful.withText('Standard breathing space'))
            .expect(res => expect(res).to.be.successful.withText('Standard breathing space'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

      context('when response not submitted', () => {
        it('should redirect to dashboard-claimant details page', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(pagePath)
            .send({ breathingSpaceType: 'STANDARD_BS_ENTERED' })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(DashboardPaths.claimantPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should render page when everything is fine', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(pagePath)
            .send({ type: SignatureType.BASIC })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
        })
      })

      context('when form is valid', () => {
        it('should redirect to climant detailes page when form is valid and cannot enter breathing space', async () => {
          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Notify debt respite scheme'))
        })
      })
    })
  })
})
