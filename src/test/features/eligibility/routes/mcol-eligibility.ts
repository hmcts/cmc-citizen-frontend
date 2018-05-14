import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'eligibility/paths'
import { app } from 'main/app'

const pagePath: string = Paths.mcolEligibilityPage.uri
const expectedTextOnPage: string = 'You can use the existing MCOL service to claim'

describe('Claim eligibility: Mcol eligibility', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })
})
