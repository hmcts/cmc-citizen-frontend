import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import { YesNoOption } from 'models/yesNoOption'

const pagePath: string = Paths.helpWithFeesReferencePage.uri
const pageRedirect: string = Paths.hwfEligibleReferencePage.uri
const expectedTextOnPage: string = 'Do you have a Help With Fees reference number?'

describe('Claim eligibility: help with fees reference number page', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it("Should render page with 'Do you have a Help With Fees reference number?' ", async () => {

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

    it('Should redirect to Help with Fees Eligible Reference Page', async () => {

      await request(app)
        .post(pagePath)
        .send({ helpWithFeesReference: YesNoOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('Should redirect to Help with Fees Eligible Page', async () => {

      await request(app)
        .post(pagePath)
        .send({ helpWithFeesReference: YesNoOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.hwfEligiblePage.uri))
    })
  })
})
