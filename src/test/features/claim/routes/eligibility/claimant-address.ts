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
import { YesNoOption } from 'models/yesNoOption'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim eligibility: claimant address page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.eligibilityClaimantAddressPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.eligibilityClaimantAddressPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Do you live in the UK?'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.eligibilityClaimantAddressPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.eligibilityClaimantAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Do you live in the UK?', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(ClaimPaths.eligibilityClaimantAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimantAddress: YesNoOption.YES.option })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to defendant address page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.eligibilityClaimantAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimantAddress: YesNoOption.YES.option })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.eligibilityDefendantAddressPage.uri))
      })
      it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.eligibilityClaimantAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimantAddress: YesNoOption.NO.option })
          .expect(res => expect(res).to.be.redirect.toLocation(`${ClaimPaths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIMANT_ADDRESS}`))
      })
    })
  })
})
