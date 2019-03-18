import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'
import { Paths } from 'directions-questionnaire/paths'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/routes/authorization-check'
import * as idamServiceMock from 'test/http-mocks/idam'
import { expect } from 'chai'
import { Paths as DashboardPaths } from 'dashboard/paths'
import * as config from 'config'
import * as request from 'supertest'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { createClaim } from './helper/dqRouteHelper'
import { PartyType } from 'integration-test/data/party-type'
import { MadeBy } from 'offer/form/models/madeBy'

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const claim = createClaim(PartyType.INDIVIDUAL, PartyType.ORGANISATION, MadeBy.CLAIMANT)

const pagePath = Paths.hearingDatesPage.evaluateUri({ externalId: externalId })
const cookieName: string = config.get<string>('session.cookieName')

function checkAccessGuard (app: any, method: string) {

  it('should redirect to dashboard page when DQ is not enabled for claim', async () => {
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
  })
}

describe('Directions Questionnaire - hearing unavailable dates', () => {
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
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
        draftStoreServiceMock.resolveFind('directionsQuestionnaire')
        draftStoreServiceMock.resolveFind('response')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Choose a hearing location'))
      })
    })
  })

})
