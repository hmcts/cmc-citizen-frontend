import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as OrdersPaths } from 'orders/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { FeatureToggles } from 'utils/featureToggles'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'
const pagePath = OrdersPaths.disagreeReasonPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const pageTitle = 'How and why do you want the order changed?'

if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
  describe('Orders: why do you disagree with the order page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })
        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('orders')
          claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'directionsQuestionnaire' })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(pageTitle))
        })
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)

      context('when defendant authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

        context('when response not submitted', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            draftStoreServiceMock.resolveFind('orders')
            draftStoreServiceMock.rejectSave()
            claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'directionsQuestionnaire' })

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ reason: 'I want a judge to review' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to the dashboard when nothing is entered', async () => {
            draftStoreServiceMock.resolveFind('orders')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'directionsQuestionnaire' })
            claimStoreServiceMock.resolveSaveOrder()
            draftStoreServiceMock.resolveFind('orders')
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ reason: '' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(OrdersPaths.confirmationPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to the dashboard when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('orders')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'directionsQuestionnaire' })
            claimStoreServiceMock.resolveSaveOrder()
            draftStoreServiceMock.resolveFind('orders')
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ reason: 'I want a judge to review' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(OrdersPaths.confirmationPage.evaluateUri({ externalId: externalId })))
          })
        })
      })
    })
  })
}
