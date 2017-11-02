import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import '../../../../routes/expectations'
import { checkAuthorizationGuards } from '../checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../../main/app'

import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim eligibility: claim value page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.eligibilityClaimValuePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.eligibilityClaimValuePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Total amount you’re claiming'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.eligibilityClaimValuePage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.eligibilityClaimValuePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Total amount you’re claiming', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(ClaimPaths.eligibilityClaimValuePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimValue: ClaimValue.UNDER_10000.option })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to over 18 page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.eligibilityClaimValuePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimValue: ClaimValue.UNDER_10000.option })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.eligibilityOver18Page.uri))
      })
      it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.eligibilityClaimValuePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimValue: ClaimValue.NOT_KNOWN.option })
          .expect(res => expect(res).to.be.redirect.toLocation(`${ClaimPaths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_VALUE_NOT_KNOWN}`))
      })
    })
  })
})
