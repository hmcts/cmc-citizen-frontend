import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

const pagePath: string = Paths.hwfEligibleReferencePage.uri
const expectedTextOnPage: string = 'Remember that you will not know about the fee until we have processed your Help with Fees application. Your claim will only be issued after Help with Fees is confirmed, or the fee is paid.'

describe('Claim eligibility: You can use this Service HwF Eligible with reference number', () => {
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
