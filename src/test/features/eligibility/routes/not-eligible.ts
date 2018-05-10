import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { app } from 'main/app'

import { Paths } from 'eligibility/paths'

const pagePath: string = Paths.notEligiblePage.uri
const expectedTextOnPage: string = 'You can’t use this service'

describe('Claim eligibility: not eligible page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })
})
