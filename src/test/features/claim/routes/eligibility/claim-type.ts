import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import '../../../../routes/expectations'
import { checkAuthorizationGuards } from '../checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from '../../../../../main/app'

import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ClaimType } from 'claim/form/models/eligibility/claimType'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.eligibilityClaimTypePage.uri
const pageRedirect: string = Paths.eligibilitySingleDefendantPage.uri
const expectedTextOnPage: string = 'Who are you making the claim for?'

describe('Claim eligibility: claim type page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimType: ClaimType.PERSONAL_CLAIM.option })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to single defendant page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimType: ClaimType.PERSONAL_CLAIM.option })
          .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
      })
      it('should redirect to not eligible page when form is valid and multiple claimants option selected', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimType: ClaimType.MULTIPLE_CLAIM.option })
          .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.MULTIPLE_CLAIMANTS}`))
      })

      it('should redirect to not eligible page when form is valid and claim on behalf option selected', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimType: ClaimType.REPRESENTATIVE_CLAIM.option })
          .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_ON_BEHALF}`))
      })
    })
  })
})
