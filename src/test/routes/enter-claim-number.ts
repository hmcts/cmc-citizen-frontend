import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'

describe('Returning user: Enter claim number', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      await request(app)
        .get(Paths.enterClaimNumberPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Enter your claim number'))
    })
  })

  describe('on POST', () => {
    it('should render page when form is invalid and everything is fine', async () => {
      await request(app)
        .post(Paths.enterClaimNumberPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Enter your claim number', 'div class="error-summary"'))
    })

    it('should redirect to home page when form is valid and everything is fine', async () => {
      await request(app)
        .post(Paths.enterClaimNumberPage.uri)
        .send({ reference: '100MC001' })
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.homePage.uri))
    })

    it('should redirect to mcol when ccbc prefix is used', async () => {
      await request(app)
        .post(Paths.enterClaimNumberPage.uri)
        .send({ reference: 'A1BA1123' })
        .expect(res => expect(res).to.be.redirect.toLocation(config.get<string>('mcol.url')))
    })

    it('should render the page when invalid reference is used', async () => {
      await request(app)
        .post(Paths.enterClaimNumberPage.uri)
        .send({ reference: '1234567' })
        .expect(res => expect(res).to.be.successful.withText('Enter your claim number', 'div class="error-summary"'))
    })

  })
})
