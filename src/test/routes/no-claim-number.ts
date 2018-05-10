import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'
import { Service } from 'models/service'

describe('Returning user: No claim number', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      await request(app)
        .get(Paths.noClaimNumberPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Which service did you use to view or make the claim?'))
    })
  })

  describe('on POST', () => {
    it('should render page when form is invalid and everything is fine', async () => {
      await request(app)
        .post(Paths.noClaimNumberPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Which service did you use to view or make the claim?', 'div class="error-summary"'))
    })

    it('should redirect to home page when moneyclaims service is picked', async () => {
      await request(app)
        .post(Paths.noClaimNumberPage.uri)
        .send({ service: Service.MONEYCLAIMS.option })
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.homePage.uri))
    })

    it('should redirect to mcol when mcol service is picked', async () => {
      await request(app)
        .post(Paths.noClaimNumberPage.uri)
        .send({ service: Service.MCOL.option })
        .expect(res => expect(res).to.be.redirect.toLocation(config.get<string>('mcol.url')))
    })
  })
})
