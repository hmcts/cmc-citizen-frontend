import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

const pagePath: string = Paths.helpWithFeesReferencePage.uri
const pageRedirect: string = Paths.singleDefendantPage.uri
const expectedTextOnPage: string = 'Do you have a Help With Fees reference number?'
const notEligibleReason: string = NotEligibleReason.HELP_WITH_FEES_REFERENCE

describe('Claim eligibility: help with fees reference page', () => {
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
        .send({ helpWithFeesReference: YesNoOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {

      await request(app)
        .post(pagePath)
        .send({ helpWithFeesReference: YesNoOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${notEligibleReason}`))
    })
  })
})
