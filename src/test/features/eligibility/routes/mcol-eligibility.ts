import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'eligibility/paths'
import { app } from '../../../../main/app'

const mcolEligibilityPage: string = Paths.mcolEligibilityPage.uri

describe('Mcol eligibility', () => {
  attachDefaultHooks(app)

  describe('on Get', () => {
    it('should render page when everything is fine', async () => {

      await request(app)
        .get(mcolEligibilityPage)
        .expect(res => expect(res).to.be.successful.withText('You can use the existing MCOL service to claim'))
    })
  })
})
