import { expect } from 'chai'
import { YesNoOption } from 'models/yesNoOption'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import { NotEligibleReason } from 'eligibility/notEligibleReason'

const pagePath: string = Paths.over18Page.uri
const pageRedirect: string = Paths.helpWithFeesPage.uri
const expectedTextOnPage: string = 'Are you 18 or over?'
const notEligibleReason: string = NotEligibleReason.UNDER_18

describe('Claim eligibility: over 18 page', () => {
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

    it('should redirect to over 18 defendant page when form is valid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .send({ eighteenOrOver: YesNoOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {

      await request(app)
        .post(pagePath)
        .send({ eighteenOrOver: YesNoOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${notEligibleReason}`))
    })
  })
})
