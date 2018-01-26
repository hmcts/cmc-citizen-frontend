import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: claimant party type selection page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantPartyTypeSelectionPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.claimantPartyTypeSelectionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('About you and this claim'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimantPartyTypeSelectionPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when form is invalid', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.claimantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: undefined })
          .expect(res => expect(res).to.be.successful.withText('About you and this claim', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim', { claimant: undefined })
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(ClaimPaths.claimantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'individual' })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to individual details page when Individual party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { claimant: undefined })
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.claimantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'individual' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantIndividualDetailsPage.uri))
      })

      it('should redirect to sole trader details page when soleTrader party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { claimant: undefined })
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.claimantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'soleTrader' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantSoleTraderOrSelfEmployedDetailsPage.uri))
      })

      it('should redirect to company details page when company party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { claimant: undefined })
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.claimantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'company' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantCompanyDetailsPage.uri))
      })

      it('should redirect to organization details page when organization party type selected ', async () => {
        draftStoreServiceMock.resolveFind('claim', { claimant: undefined })
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.claimantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: 'organisation' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantOrganisationDetailsPage.uri))
      })
    })
  })
})
