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
import { YesNoOption } from 'models/yesNoOption'
import { FeatureToggles } from 'utils/featureToggles'

const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['directionsQuestionnaire'] }
}

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const otherWitnessesPage = Paths.otherWitnessesPage.evaluateUri({ externalId: externalId })
const pagePath = Paths.selfWitnessPage.evaluateUri({ externalId: externalId })

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
  describe('Directions Questionnaire - self witness page', () => {
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
            .expect(res => expect(res).to.be.successful.withText('Do you want to give evidence?'))
        })
      })
    })

    describe('on POST', () => {
      const validFormData = { option: YesNoOption.YES.option }
      const invalidFormData = { option: undefined }

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
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 when cannot retrieve DQ draft', async () => {
          draftStoreServiceMock.rejectFind('Error')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
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
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to other witnesses page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(otherWitnessesPage))
          })
        })

        context('when form is invalid', async () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(invalidFormData)
              .expect(res => expect(res).to.be.successful.withText('Do you want to give evidence?', 'div class="error-summary"'))
          })
        })
      })
    })
  })
}
