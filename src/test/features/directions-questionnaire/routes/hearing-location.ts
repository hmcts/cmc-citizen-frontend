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
import * as courtFinderMock from 'test/http-mocks/court-finder-client'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'

import { createClaim } from 'test/features/directions-questionnaire/routes/helper/dqRouteHelper'
import { MadeBy } from 'claims/models/madeBy'
import { PartyType } from 'integration-test/data/party-type'

const claim = createClaim(PartyType.INDIVIDUAL, PartyType.ORGANISATION, MadeBy.CLAIMANT)

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const expertPath = Paths.expertPage.evaluateUri({ externalId: externalId })
const pagePath = Paths.hearingLocationPage.evaluateUri({ externalId: externalId })

function checkAccessGuard (app: any, method: string) {

  it(`should redirect to dashboard page when DQ is not enabled for claim`, async () => {
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
  })
}

describe('Directions Questionnaire - hearing location', () => {
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

      context('when court finder client is not functioning', () => {
        it('should render fallback page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')
          courtFinderMock.rejectFind()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withoutText('is the nearest to your address you gave us.'))
        })
      })

      context('when court finder client is functioning', () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')
          courtFinderMock.resolveFind()
          courtFinderMock.resolveCourtDetails()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', `${courtFinderMock.searchResponse[0].name} is the nearest to your home address you gave us.`))
        })
      })

    })
  })

  describe('on POST', () => {
    const validFormDataAccept = { courtAccepted: 'yes', courtName: 'Test court' }
    const validFormDataAcceptAlternatePostcode = {
      courtAccepted: 'no',
      alternativeOption: 'postcode',
      alternativePostcode: 'a111aa',
      courtName: 'Test court'
    }
    const validFormDataAcceptAlternateName = {
      courtAccepted: 'no',
      alternativeOption: 'name',
      alternativeCourtName: 'Test Court Name',
      courtName: 'Test court'
    }
    const invalidFormData = { courtAccepted: 'no' }

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
          .send(validFormDataAccept)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve DQ draft', async () => {
        draftStoreServiceMock.rejectFind('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormDataAccept)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should return 500 and render error page when cannot save DQ draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.rejectSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormDataAccept)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        context('When court is accepted', () => {
          it('should redirect to expert page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormDataAccept)
              .expect(res => expect(res).to.be.redirect.toLocation(expertPath))
          })
        })

        context('When court is rejected', () => {
          it('should redirect to expert page when an alternative court is suggested by name', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormDataAcceptAlternateName)
              .expect(res => expect(res).to.be.redirect.toLocation(expertPath))
          })

          it('should render same page with new court when an alternative court is suggested by postcode', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormDataAcceptAlternatePostcode)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location'))
          })
        })
      })

      context('when form is invalid', async () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidFormData)
            .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
        })
      })

      context('when submit from fallback page', () => {
        context('when form is valid', () => {
          it('should redirect to expert page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ alternativeCourtName: 'Test' })
              .expect(res => expect(res).to.be.redirect.toLocation(expertPath))
          })
        })

        context('when form is invalid', () => {
          it('should render the page with errors', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ alternativeCourtName: undefined })
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
          })
        })
      })
    })
  })

})
