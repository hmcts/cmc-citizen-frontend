import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import { YesNoOption } from 'models/yesNoOption'

const pagePath: string = Paths.infoAboutHwFeligibilityPage.uri
const pageRedirect: string = Paths.helpWithFeesPage.uri
const expectedTextOnPage: string = 'Some useful information about Help with Fees'

describe('Claim eligibility: information about help with fees', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it("should render page with 'Some useful information about Help with Fees' ", async () => {

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

    it("should display the 'help with fees page' page when NO is submitted", async () => {

      await request(app)
        .post(pagePath)
        .send({ infoAboutHwFeligibility: YesNoOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it("should display the 'apply for help with fees' page when YES is submitted", async () => {

      await request(app)
        .post(pagePath)
        .send({ infoAboutHwFeligibility: YesNoOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.applyForHelpWithFeesPage.uri))
    })
  })
})
