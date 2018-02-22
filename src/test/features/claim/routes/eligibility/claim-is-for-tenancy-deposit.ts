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
const pagePath: string = ClaimPaths.eligibilityClaimIsForTenancyDepositPage.uri
const pageRedirect: string = ClaimPaths.eligibilityEligiblePage.uri
const expectedTextOnPage: string = 'Is your claim for a tenancy deposit?'

describe('Claim eligibility: is claim for tenancy deposit page', () => {
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
          .send({ claimIsForTenancyDeposit: YesNoOption.NO.option })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to eligible page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimIsForTenancyDeposit: YesNoOption.NO.option })
          .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
      })

      it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ claimIsForTenancyDeposit: YesNoOption.YES.option })
          .expect(res => expect(res).to.be.redirect.toLocation(`${ClaimPaths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_IS_FOR_TENANCY_DEPOSIT}`))
      })
    })
  })
})
