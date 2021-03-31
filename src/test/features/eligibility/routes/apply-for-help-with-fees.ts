import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

const pagePath: string = Paths.applyForHelpWithFeesPage.uri
const pageRedirect: string = Paths.helpWithFeesReferencePage.uri
const expectedTextOnPage: string = 'Apply for Help with Fees'

describe('Claim eligibility: Apply for help with fees', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it("should render page with 'Apply for Help with Fees' ", async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  context('on POST', () => {
    checkAuthorizationMiddleware(app, 'post', pagePath)
    it.only("should display the 'Do you have a help with fees reference number' ", async () => {

      await request(app)
        .post(pagePath)
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })
  })
})
