import { expect } from 'chai'
import * as request from 'supertest'

import '../routes/expectations'

import { app } from '../../main/app'
import { Paths } from 'app/paths'

describe('Cookies page', () => {
  describe('on GET', () => {
    it('should render cookies page when everything is fine', async () => {
      await request(app)
        .get(Paths.cookiesPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Cookies'))
    })
  })
})
