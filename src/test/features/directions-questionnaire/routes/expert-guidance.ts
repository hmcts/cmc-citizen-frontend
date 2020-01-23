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
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { FeatureToggles } from 'utils/featureToggles'

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const cookieName: string = config.get<string>('session.cookieName')
const pagePath = Paths.expertGuidancePage.evaluateUri({ externalId })

const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['directionsQuestionnaire'] }
}

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
  describe('Directions Questionnaire - expert guidance page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Using an expert in small claims'))
        })
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        context('when form is valid', async () => {

          it('should redirect to dashboard when click on Continue', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send()
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.permissionForExpertPage.evaluateUri(
                { externalId: externalId })))
          })
        })
      })
    })
  })
}
