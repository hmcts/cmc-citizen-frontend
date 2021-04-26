import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import { YesNoOption } from 'models/yesNoOption'

const pagePath: string = Paths.helpWithFeesPage.uri
const pageRedirect: string = Paths.eligiblePage.uri
const expectedTextOnPage: string = 'Do you need help paying your court fee?'

describe('Claim eligibility: help with fees page', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it("should render page with 'Do you need help paying your court fee?' ", async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  context('on POST', () => {
    checkAuthorizationMiddleware(app, 'post', pagePath)

    it('should render page with error message when form is invalid', async () => {

      await request(app)
        .post(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
    })

    it('should redirect to eligible page when NO is submitted', async () => {

      await request(app)
        .post(pagePath)
        .send({ helpWithFees: YesNoOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to eligible page when YES is submitted', async () => {

      await request(app)
        .post(pagePath)
        .send({ helpWithFees: YesNoOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.infoAboutHwFeligibilityPage.uri))
    })
  })
})
