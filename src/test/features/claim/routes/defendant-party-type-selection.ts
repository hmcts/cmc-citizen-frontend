import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const expectedTextOnPage: string = 'Who are you making the claim against?'

describe('Claim issue: defendant party type selection page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantPartyTypeSelectionPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.defendantPartyTypeSelectionPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.defendantPartyTypeSelectionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantPartyTypeSelectionPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.defendantPartyTypeSelectionPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when form is invalid', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: undefined })
          .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim', { defendant: undefined })
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'individual' })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to individual details page when Individual party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { defendant: undefined })
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'individual' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantIndividualDetailsPage.uri))
      })

      it('should redirect to sole trader details page when soleTrader party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { defendant: undefined })
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'soleTrader' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri))
      })

      it('should redirect to company details page when company party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { defendant: undefined })
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'company' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantCompanyDetailsPage.uri))
      })

      it('should redirect to organization details page when organization party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { defendant: undefined })
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'organisation' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantOrganisationDetailsPage.uri))
      })
    })
  })
})
