import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'
import { app } from 'main/app'

import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { YesNoOption } from 'models/yesNoOption'

const pagePath: string = Paths.claimantAddressPage.uri
const pageRedirect: string = Paths.defendantAddressPage.uri
const expectedTextOnPage: string = 'Do you have a postal address in the UK?'
const notEligibleReason: string = NotEligibleReason.CLAIMANT_ADDRESS

describe('Claim eligibility: claimant address page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  describe('on POST', () => {
    checkAuthorizationMiddleware(app, 'post', pagePath)

    it('should render page when form is invalid and everything is fine', async () => {
      await request(app)
        .post(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
    })

    it('should redirect to defendant address page when form is valid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
          .send({ claimantAddress: YesNoOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })
    it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {

      await request(app)
        .post(pagePath)
        .send({ claimantAddress: YesNoOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${notEligibleReason}`))
    })
  })
})
