import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

const pagePath: string = Paths.hwfEligiblePage.uri
const expectedTextOnPage: string = 'You will have to pay court fees unless you are eligible for Help with Fees.'

describe('Claim eligibility: You can use this Service HwF Eligible without reference number', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it("should render page with 'You can use this service' ", async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })
})
