import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'directions-questionnaire/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'
import { FeatureToggles } from 'utils/featureToggles'

const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['directionsQuestionnaire'] }
}

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const selfWitnessPage = Paths.selfWitnessPage.evaluateUri({ externalId })
const expertGuidance = Paths.expertGuidancePage.evaluateUri({ externalId })
const pagePath = Paths.expertReportsPage.evaluateUri({ externalId })

function checkAccessGuard (app: any, method: string) {

  it(`should redirect to dashboard page when DQ is not enabled for claim`, async () => {
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
  })
}

if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
  describe('Directions Questionnaire - expert reports page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

        })

        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve directions questionnaire draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Have you already got a report written by an expert?'))
        })
      })
    })

    describe('on POST', () => {
      const validDeclaredFormData = {
        declared: 'yes',
        rows: [{ expertName: 'Kevin Bacon', reportDate: { year: 2019, month: 1, day: 1 } }]
      }
      const validDeclinedFormData = { declared: 'no', rows: [] }
      const invalidFormData = { declared: 'yes', rows: [] }

      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validDeclinedFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 when cannot retrieve DQ draft', async () => {
          draftStoreServiceMock.rejectFind('Error')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validDeclinedFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        context('when form is valid', async () => {
          it('should return 500 and render error page when cannot save DQ draft', async () => {
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectUpdate()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validDeclinedFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to self witness page when reports declared', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validDeclaredFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(selfWitnessPage))
          })

          it('should redirect to expert guidance page when reports declined', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validDeclinedFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(expertGuidance))
          })
        })

        context('when form is invalid', () => {
          it('should return to the same page with an error message', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(invalidFormData)
              .expect(res => expect(res).to.be.successful.withText(
                'Have you already got a report written by an expert?',
                'div class="error-summary"'
              ))
          })
        })
      })
    })
  })
}
