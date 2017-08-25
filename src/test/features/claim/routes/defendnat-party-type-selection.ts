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

describe('defendant party type selection page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantPartyTypeSelectionPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      draftStoreServiceMock.resolveRetrieve('claim')

      await request(app)
        .get(ClaimPaths.defendantPartyTypeSelectionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('About them'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantPartyTypeSelectionPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant', 'defendant')
      })

      it('should render page with error when form is invalid', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: {value: '', displayValue: ''} })
          .expect(res => expect(res).to.be.successful.withText('About them', 'div class="error-summary"'))
      })

      it('should redirect to individual details page when Individual party type selected ', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: {value: 'individual', displayValue: 'Individual'} })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantIndividualDetailsPage.uri))
      })

      it('should redirect to sole trader details page when soleTrader party type selected ', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: {value: 'soleTrader', displayValue: 'soleTrader'} })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri))
      })

      it('should redirect to company details page when company party type selected ', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: {value: 'company', displayValue: 'company'} })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantCompanyDetailsPage.uri))
      })
      it('should redirect to organization details page when organization party type selected ', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')

        await request(app)
          .post(ClaimPaths.defendantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: {value: 'organisation', displayValue: 'organisation'} })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantOrganisationDetailsPage.uri))
      })
    })
  })
})
