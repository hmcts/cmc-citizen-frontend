import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { ClaimType } from 'eligibility/model/claimType'

const pagePath: string = Paths.claimTypePage.uri
const pageRedirect: string = Paths.claimantAddressPage.uri
const expectedTextOnPage: string = 'Who are you making the claim for?'

describe('Claim eligibility: claim type page', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  context('on POST', () => {
    checkAuthorizationMiddleware(app, 'post', pagePath)

    it('should render page when form is invalid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
    })

    it('should redirect to single defendant page when form is valid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .send({ claimType: ClaimType.PERSONAL_CLAIM.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to not eligible page when form is valid and multiple claimants option selected', async () => {

      await request(app)
        .post(pagePath)
        .send({ claimType: ClaimType.MULTIPLE_CLAIM.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${NotEligibleReason.MULTIPLE_CLAIMANTS}`))
    })

    it('should redirect to not eligible page when form is valid and claim on behalf option selecteds', async () => {

      await request(app)
        .post(pagePath)
        .send({ claimType: ClaimType.REPRESENTATIVE_CLAIM.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_ON_BEHALF}`))
    })
  })
})
