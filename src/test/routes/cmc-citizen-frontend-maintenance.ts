import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'

describe('CMC citizen frontend maintenance page', () => {
  describe('on GET', () => {
    it('should render maintenance page when everything is fine', async () => {
      await request(app)
        .get(Paths.cmcCitizenFrontendMaintenancePage.uri)
        .expect(res => expect(res).to.be.successful.withText('Sorry, there’s a problem with this service'))
    })
  })
})
